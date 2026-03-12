import React from 'react';
import { Users, ClipboardList, UserCheck, AlertTriangle, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KpiCard } from '../components/ui/KpiCard';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge, statusVariant } from '../components/ui/Badge';
import { StatusDot } from '../components/ui/StatusDot';
import { kpis, workflowFunnel, activityFeed } from '../data/kpis';
import { systems } from '../data/systems';
import type { ActivityItem, SystemStatus } from '../types';

const kpiIcons = [
  <Users size={20} />,
  <UserCheck size={20} />,
  <ClipboardList size={20} />,
  <AlertTriangle size={20} />,
];

const activityIcon: Record<ActivityItem['type'], React.ReactNode> = {
  sync: <RefreshCw size={13} className="text-blue-500" />,
  intake: <ClipboardList size={13} className="text-indigo-500" />,
  match: <UserCheck size={13} className="text-emerald-500" />,
  alert: <AlertTriangle size={13} className="text-amber-500" />,
  approval: <CheckCircle size={13} className="text-emerald-500" />,
};

const syncStatusLabel: Record<SystemStatus, string> = {
  Synced: 'Synced',
  Stale: 'Stale',
  Error: 'Error',
  Pending: 'Pending',
};

export const DashboardPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Operations Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Real-time view across all connected systems · Updated just now</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} icon={kpiIcons[i]} />
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Workflow funnel */}
        <div className="col-span-3">
          <Card>
            <CardHeader
              title="Member Intake Workflow"
              subtitle="Current stage distribution across 11 active applications"
              action={
                <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-full px-2.5 py-1 font-medium flex items-center gap-1">
                  <AlertCircle size={12} /> 3 bottlenecks
                </span>
              }
            />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={workflowFunnel} layout="vertical" barCategoryGap={10}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="stage" width={90} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    formatter={(v) => [`${v} applications`, '']}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
                    {workflowFunnel.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap gap-2">
                {workflowFunnel.map(s => (
                  <div key={s.stage} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: s.color }} />
                    {s.stage}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Activity feed */}
        <div className="col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader title="Recent Activity" subtitle="Today's operational events" />
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700">
              {activityFeed.map(item => (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    {activityIcon[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug">{item.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} className="text-slate-400 dark:text-slate-500" />
                      <span className="text-xs text-slate-400 dark:text-slate-500">{item.timestamp}</span>
                      {item.system && (
                        <span className="text-xs text-slate-400 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded px-1.5 py-0.5">{item.system}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Sync health table */}
      <Card>
        <CardHeader
          title="System Sync Health"
          subtitle="Live status of all connected data sources"
          action={
            <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <RefreshCw size={12} /> Refresh all
            </button>
          }
        />
        <div className="divide-y divide-slate-50 dark:divide-slate-700">
          {systems.map(sys => (
            <div key={sys.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <StatusDot status={sys.status} size="md" />
              <div className="w-48 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{sys.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{sys.type}</p>
              </div>
              <div className="flex-1">
                {sys.issues && sys.issues.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {sys.issues.map(issue => (
                      <span key={issue} className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 border border-amber-200 dark:border-amber-800 rounded px-2 py-0.5">
                        {issue}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">No issues detected</span>
                )}
              </div>
              <div className="text-right shrink-0">
                <Badge label={syncStatusLabel[sys.status]} variant={statusVariant(sys.status)} />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sys.recordCount.toLocaleString()} records</p>
              </div>
              <div className="text-right shrink-0 w-32">
                <p className="text-xs text-slate-500 dark:text-slate-400">Last sync</p>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {new Date(sys.lastSync).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};
