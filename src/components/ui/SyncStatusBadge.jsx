// src/components/ui/SyncStatusBadge.jsx
import React from 'react';
import { useSmartSync } from '../../hooks/useSmartSync';

const SyncStatusBadge = () => {
  const { isOnline, pendingCount, isSyncing, triggerSync } = useSmartSync();

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300';
    if (isSyncing) return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 animate-pulse';
    if (pendingCount > 0) return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300';
  };

  const getText = () => {
    if (!isOnline) return '📴 Offline Mode';
    if (isSyncing) return '🔄 Syncing...';
    if (pendingCount > 0) return `⏳ ${pendingCount} Pending`;
    return '✅ All Synced';
  };

  return (
    <div className={`px-4 py-2 rounded-full border text-sm font-semibold flex items-center gap-2 ${getStatusColor()}`}>
      <span>{getText()}</span>
      {pendingCount > 0 && isOnline && !isSyncing && (
        <button onClick={triggerSync} className="underline text-xs ml-1 hover:opacity-80">
          Sync Now
        </button>
      )}
    </div>
  );
};

export default SyncStatusBadge;