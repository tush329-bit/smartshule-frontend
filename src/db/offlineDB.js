// src/db/offlineDB.js
import Dexie from 'dexie';

const db = new Dexie('SmartShuleOfflineDB');

// Version 2: We use a unified queue for maximum flexibility
db.version(2).stores({
  // The magic queue: stores ANY action (marks, attendance, notes) waiting to be synced
  syncQueue: '++id, entityType, syncStatus, createdAt',
  
  // We keep local caches for fast UI rendering even when offline
  localStudents: 'id, name, classId',
  localClasses: 'id, name'
});

export default db;