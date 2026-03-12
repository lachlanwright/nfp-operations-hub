import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  GitBranch,
  Bell,
  Settings,
  ChevronRight,
  Activity,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/intake', label: 'Member Intake', icon: <ClipboardList size={18} /> },
  { to: '/volunteers', label: 'Volunteer Matching', icon: <Users size={18} /> },
  { to: '/integration', label: 'Integration Layer', icon: <GitBranch size={18} /> },
];

export const AppShell: React.FC = () => {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Activity size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">NFP Operations</p>
              <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Hub</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Navigation</p>
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>{icon}</span>
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} className="text-blue-200" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-slate-700/50 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>

        {/* Version */}
        <div className="px-5 py-3 border-t border-slate-700/50">
          <p className="text-slate-600 text-xs">v1.0 · Demo Mode</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
      {/* Demo banner */}
        <div className="bg-red-600 text-white text-center text-xs py-1.5 px-4 shrink-0">
          This is a demo only using AI-generated sample data. It is not for production use and any likeness to the real world is entirely unintentional.
        </div>
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">NFP Operations Hub</h1>
            <p className="text-xs text-slate-400">Unified operational layer · 6 connected systems</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              1 system error
            </div>
            <div className="relative">
              <button
                onClick={() => setNotifOpen(n => !n)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center relative transition-colors"
              >
                <Bell size={16} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
                  <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">Notifications</p>
                  {[
                    { msg: 'HR API auth token expired', time: '4h ago', type: 'error' },
                    { msg: 'Salesforce sync is 48h+ stale', time: '6h ago', type: 'warning' },
                    { msg: '3 member applications need review', time: '1d ago', type: 'info' },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                      <p className="text-sm text-slate-700">{n.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-xs font-bold">PS</span>
              </div>
              <div className="text-xs">
                <p className="font-medium text-slate-700">Priya Sharma</p>
                <p className="text-slate-400">Operations Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
