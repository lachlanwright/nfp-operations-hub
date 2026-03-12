import React from 'react';
import type { SystemStatus } from '../../types';

interface StatusDotProps {
  status: SystemStatus;
  size?: 'sm' | 'md';
}

const dotColor: Record<SystemStatus, string> = {
  Synced: 'bg-emerald-500',
  Stale: 'bg-amber-400',
  Error: 'bg-red-500 animate-pulse',
  Pending: 'bg-slate-400',
};

export const StatusDot: React.FC<StatusDotProps> = ({ status, size = 'sm' }) => {
  const sz = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  return <span className={`inline-block rounded-full ${sz} ${dotColor[status]}`} />;
};
