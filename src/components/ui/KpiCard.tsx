import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI } from '../../types';

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
  red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500' },
};

interface KpiCardProps extends KPI {
  icon: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, trend, trendLabel, color = 'blue', icon }) => {
  const c = colorMap[color] ?? colorMap.blue;
  const TrendIcon = trend === 0 ? Minus : trend && trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend === 0 ? 'text-slate-400' : trend && trend > 0 ? 'text-emerald-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${c.bg}`}>
          <span className={c.icon}>{icon}</span>
        </div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-xs ${trendColor}`}>
          <TrendIcon size={12} />
          <span className="font-medium">{trend > 0 ? '+' : ''}{trend}%</span>
          <span className="text-slate-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};
