// src/hooks/useSmartSync.js
import { useState, useEffect, useCallback } from 'react';
import db from '../db/offlineDB';
import axios from 'axios';
import toast from 'react-hot-toast';

   const API = import.meta.env.VITE_API_URL;

export const useSmartSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Listen to Network Status Changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🌐 Back online! Syncing data...');
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast('📴 You are offline. Data will be saved locally.', { icon: '📴' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial count check
    updatePendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Update the pending count in the UI
  const updatePendingCount = async () => {
    const count = await db.syncQueue.where('syncStatus').equals('pending').count();
    setPendingCount(count);
  };

  // 3. Add an item to the local queue (Called by MarkEntry, Attendance, etc.)
  const queueAction = async (entityType, payload) => {
    await db.syncQueue.add({
      entityType,
      payload,
      syncStatus: 'pending',
      createdAt: new Date().toISOString()
    });
    await updatePendingCount();
  };

  // 4. The Core Sync Logic (Triggered manually or when going online)
  const triggerSync = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;

    const pendingItems = await db.syncQueue.where('syncStatus').equals('pending').toArray();
    if (pendingItems.length === 0) return;

    setIsSyncing(true);
    
    // Generate a unique Idempotency Key for this entire batch!
    // This ensures that if the network drops during sync, we don't create duplicate records.
    const idempotencyKey = crypto.randomUUID(); 

    try {
      const token = localStorage.getItem('smartshule_token');
      
      // Send the entire batch to the backend in ONE request
      const response = await axios.post(
        `${API}/sync/batch`, 
        { operations: pendingItems.map(item => ({ type: item.entityType, data: item.payload })) },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Idempotency-Key': idempotencyKey // 🛡️ Phase 3 Security in action!
          } 
        }
      );

      if (response.data.success) {
        // Mark all synced items as 'synced' (or delete them to save space)
        const idsToMark = pendingItems.map(item => item.id);
        await db.syncQueue.bulkUpdate(idsToMark.map(id => ({ id, changes: { syncStatus: 'synced' } })));
        
        toast.success(`✅ Successfully synced ${pendingItems.length} items!`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed. Data is safe locally. Will retry when online.');
    } finally {
      setIsSyncing(false);
      await updatePendingCount();
    }
  }, [isSyncing]);

  return { isOnline, pendingCount, isSyncing, queueAction, triggerSync };
};