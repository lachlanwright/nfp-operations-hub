import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'gray';
  size?: 'sm' | 'md';
}

const variantClasses: Record<string, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-800',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:ring-amber-800',
  error: 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-800',
  info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-800',
  purple: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:ring-indigo-800',
  gray: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-600',
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantClasses[variant]}`}>
      {label}
    </span>
  );
};

export function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Submitted': return 'gray';
    case 'Needs Review': return 'info';
    case 'Missing Info': return 'warning';
    case 'Approved': return 'success';
    case 'CRM Synced': return 'purple';
    case 'Synced': return 'success';
    case 'Stale': return 'warning';
    case 'Error': return 'error';
    case 'Pending': return 'gray';
    default: return 'default';
  }
}
