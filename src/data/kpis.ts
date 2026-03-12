import type { KPI, ActivityItem } from '../types';

export const kpis: KPI[] = [
  { label: 'Active Members', value: 1284, trend: 4.2, trendLabel: 'vs last month', color: 'blue' },
  { label: 'Registered Volunteers', value: 94, trend: 11.8, trendLabel: 'vs last month', color: 'green' },
  { label: 'Pending Applications', value: 12, trend: -2, trendLabel: 'vs last week', color: 'amber' },
  { label: 'Systems in Error', value: 1, trend: 0, trendLabel: 'unchanged', color: 'red' },
];

export const workflowFunnel = [
  { stage: 'Submitted', count: 3, color: '#64748b' },
  { stage: 'Needs Review', count: 2, color: '#3b82f6' },
  { stage: 'Missing Info', count: 3, color: '#f59e0b' },
  { stage: 'Approved', count: 2, color: '#10b981' },
  { stage: 'CRM Synced', count: 1, color: '#6366f1' },
];

export const activityFeed: ActivityItem[] = [
  { id: 'a1', timestamp: '23:10', type: 'sync', message: 'Outlook synced — 2,103 contacts up to date', system: 'Email' },
  { id: 'a2', timestamp: '22:55', type: 'intake', message: 'New member application: Rachel Iyer (Bridgeworks NFP)', system: 'Forms' },
  { id: 'a3', timestamp: '20:00', type: 'sync', message: 'Active Directory synced — 87 accounts', system: 'Directory' },
  { id: 'a4', timestamp: '16:20', type: 'alert', message: 'HR API auth token expired — volunteer sync paused', system: 'HR System' },
  { id: 'a5', timestamp: '14:00', type: 'approval', message: 'Amara Osei (Together Now) approved and queued for CRM sync', system: 'Intake' },
  { id: 'a6', timestamp: '13:00', type: 'intake', message: 'New member application: Tom Hartley (Citizens Aid)', system: 'Forms' },
  { id: 'a7', timestamp: '11:45', type: 'alert', message: 'Missing info reminder sent to David Nguyen', system: 'Email' },
  { id: 'a8', timestamp: '10:00', type: 'match', message: 'Volunteer Lachlan Moore matched to Youth Mental Health Program', system: 'Volunteer Hub' },
];
