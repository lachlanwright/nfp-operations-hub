import React, { useState } from 'react';
import {
  Database, Mail, Users, Building, FileText, HardDrive,
  AlertTriangle, CheckCircle, Clock, ArrowRight, Layers, RefreshCw, X, ChevronDown, User
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge, statusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StatusDot } from '../components/ui/StatusDot';
import { systems, peopleProfiles } from '../data/systems';
import type { SystemSource, SystemType } from '../types';

const typeIcon: Record<SystemType, React.ReactNode> = {
  CRM: <Building size={18} />,
  Forms: <FileText size={18} />,
  HR: <Users size={18} />,
  Directory: <HardDrive size={18} />,
  'Data Warehouse': <Database size={18} />,
  Email: <Mail size={18} />,
};

const typeColor: Record<SystemType, string> = {
  CRM: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400',
  Forms: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400',
  HR: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-400',
  Directory: 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400',
  'Data Warehouse': 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800 dark:text-indigo-400',
  Email: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-400',
};

const confidenceStyle: Record<string, string> = {
  high: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300',
  medium: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300',
  low: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400',
  conflict: 'bg-red-50 border-red-300 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300',
  missing: 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300',
};

const confidenceLabel: Record<string, string> = {
  high: 'Verified',
  medium: 'Inferred',
  low: 'Unverified',
  conflict: '⚡ Conflict',
  missing: '⚠ Missing',
};

export const IntegrationPage: React.FC = () => {
  const [selectedPersonId, setSelectedPersonId] = useState(peopleProfiles[0].id);
  const [personDropdownOpen, setPersonDropdownOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<SystemSource | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [synced, setSynced] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const currentPerson = peopleProfiles.find(p => p.id === selectedPersonId)!;
  const { profile: unifiedProfile, systemRecords: systemProfiles } = currentPerson;

  const handlePersonChange = (id: string) => {
    setSelectedPersonId(id);
    setPersonDropdownOpen(false);
    setSelectedSystem(null);
  };

  const handleSync = (sys: SystemSource) => {
    if (sys.status === 'Error' || sys.status === 'Stale') {
      setSyncingId(sys.id);
      setTimeout(() => {
        setSyncingId(null);
        setSynced(prev => new Set([...prev, sys.id]));
        setToastMsg(`${sys.name} re-sync initiated successfully`);
        setTimeout(() => setToastMsg(null), 3000);
      }, 1800);
    }
  };

  const getStatus = (sys: SystemSource) => synced.has(sys.id) ? 'Synced' : sys.status;

  const conflicts = unifiedProfile.fields.filter(f => f.confidence === 'conflict').length;
  const missing = unifiedProfile.fields.filter(f => f.confidence === 'missing').length;
  const verified = unifiedProfile.fields.filter(f => f.confidence === 'high').length;

  const initials = unifiedProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          {toastMsg}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Integration & Data Intermediary Layer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Canonical data model spanning all source systems · Click a system to inspect source records</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Person selector */}
          <div className="relative">
            <button
              onClick={() => setPersonDropdownOpen(o => !o)}
              className="flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                {initials}
              </div>
              <span>{unifiedProfile.name}</span>
              <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" />
            </button>
            {personDropdownOpen && (
              <div className="absolute right-0 top-11 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Select person</p>
                {peopleProfiles.map(p => {
                  const ini = p.profile.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                  const isActive = p.id === selectedPersonId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePersonChange(p.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-950/30' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {ini}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>{p.profile.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{p.profile.organisation}</p>
                      </div>
                      {isActive && <CheckCircle size={14} className="text-blue-500 shrink-0 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 text-xs text-indigo-700">
            <Layers size={13} />
            <span className="font-medium">{systems.length} systems connected · 1 error · 1 stale</span>
          </div>
        </div>
      </div>

      {/* Architecture diagram */}
      <Card>
        <CardHeader title="Connected Source Systems" subtitle="All data flows into a canonical person & organisation model" />
        <div className="p-5">
          <div className="grid grid-cols-6 gap-3 mb-5">
            {systems.map(sys => {
              const status = getStatus(sys);
              return (
                <button
                  key={sys.id}
                  onClick={() => setSelectedSystem(s => s?.id === sys.id ? null : sys)}
                  className={`relative rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                    selectedSystem?.id === sys.id
                      ? 'border-blue-500 shadow-md ring-1 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-950/30'
                      : `border ${typeColor[sys.type]}`
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${typeColor[sys.type]}`}>
                    {typeIcon[sys.type]}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{sys.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{sys.type}</p>
                  <div className="flex items-center justify-center gap-1">
                    <StatusDot status={status} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{status}</span>
                  </div>
                  {(status === 'Error' || status === 'Stale') && !synced.has(sys.id) && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Flow arrows */}
          <div className="flex items-center justify-center gap-2 py-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 border-dashed border-t border-slate-300 dark:border-slate-600" />
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold">
              <Layers size={13} />
              NFP Operations Hub · Canonical Data Model
              <ArrowRight size={13} />
            </div>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 border-dashed border-t border-slate-300 dark:border-slate-600" />
          </div>

          {/* System detail panel */}
          {selectedSystem && (
            <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColor[selectedSystem.type]}`}>
                    {typeIcon[selectedSystem.type]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{selectedSystem.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusDot status={getStatus(selectedSystem)} size="sm" />
                      <Badge label={getStatus(selectedSystem)} variant={statusVariant(getStatus(selectedSystem))} />
                      <span className="text-xs text-slate-400 dark:text-slate-500">{selectedSystem.recordCount.toLocaleString()} records</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(selectedSystem.status === 'Error' || selectedSystem.status === 'Stale') && !synced.has(selectedSystem.id) && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<RefreshCw size={13} className={syncingId === selectedSystem.id ? 'animate-spin' : ''} />}
                      onClick={() => handleSync(selectedSystem)}
                      loading={syncingId === selectedSystem.id}
                    >
                      {syncingId === selectedSystem.id ? 'Syncing…' : 'Re-sync Now'}
                    </Button>
                  )}
                  <button onClick={() => setSelectedSystem(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {selectedSystem.issues && selectedSystem.issues.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedSystem.issues.map(issue => (
                    <span key={issue} className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                      <AlertTriangle size={12} /> {issue}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                  Source record — {unifiedProfile.name}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(systemProfiles[selectedSystem.id] || []).map(f => (
                    <div key={f.field} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                      <p className="text-xs text-slate-400 dark:text-slate-500">{f.field}</p>
                      <p className={`text-sm font-medium mt-0.5 ${f.value === '—' || f.value === '' ? 'text-slate-300 italic dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>
                        {f.value || '—'}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <Clock size={12} />
                  Last sync: {new Date(selectedSystem.lastSync).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Unified profile */}
      <div className="grid grid-cols-3 gap-5">
        {/* Profile header */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader title="Unified Person Profile" subtitle={`Canonical record · ${unifiedProfile.name}`} />
            <div className="p-5 space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-2xl font-bold flex items-center justify-center mx-auto">
                  {initials}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-3">{unifiedProfile.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{unifiedProfile.role || <span className="italic text-amber-500">Role unknown</span>}</p>
                <p className="text-xs text-indigo-600 font-medium mt-1">{unifiedProfile.organisation}</p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { label: 'Email', value: unifiedProfile.email },
                  { label: 'Phone', value: unifiedProfile.phone },
                  { label: 'Address', value: unifiedProfile.address || 'Not provided' },
                  { label: 'Member since', value: unifiedProfile.memberSince },
                ].map(f => (
                  <div key={f.label} className="flex justify-between gap-2">
                    <span className="text-slate-400 dark:text-slate-500 shrink-0">{f.label}</span>
                    <span className={`font-medium text-right ${f.value === 'Not provided' ? 'text-slate-300 italic dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>{f.value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-emerald-600">{verified}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Verified</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-500">{conflicts}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Conflicts</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-500">{missing}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Missing</p>
                </div>
              </div>

              {/* Switch person prompt */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1"><User size={11} /> Other profiles</p>
                <div className="space-y-1">
                  {peopleProfiles.filter(p => p.id !== selectedPersonId).map(p => (
                    <button
                      key={p.id}
                      onClick={() => handlePersonChange(p.id)}
                      className="w-full text-left text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg px-2 py-1.5 transition-colors flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {p.profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                      <span className="truncate">{p.profile.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Field-level view */}
        <div className="col-span-2">
          <Card>
            <CardHeader
              title="Field-Level Source Comparison"
              subtitle="Data quality signals across all systems"
              action={
                <div className="flex items-center gap-3 text-xs">
                  {['high', 'conflict', 'missing', 'medium'].map(c => (
                    <span key={c} className={`px-2 py-0.5 rounded-full border ${confidenceStyle[c]}`}>{confidenceLabel[c]}</span>
                  ))}
                </div>
              }
            />
            <div className="divide-y divide-slate-50 dark:divide-slate-700 max-h-96 overflow-y-auto scrollbar-thin">
              {unifiedProfile.fields.map((f, i) => (
                <div key={i} className={`flex items-center gap-4 px-5 py-3 ${f.confidence === 'conflict' ? 'bg-red-50/40 dark:bg-red-950/20' : f.confidence === 'missing' ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''}`}>
                  <div className="w-32 shrink-0">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{f.label}</p>
                  </div>
                  <div className="w-28 shrink-0">
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded px-2 py-0.5">{f.source}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!f.value ? 'text-slate-300 italic dark:text-slate-600' : 'text-slate-700 font-medium dark:text-slate-200'}`}>
                      {f.value || 'Not provided'}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${confidenceStyle[f.confidence]}`}>
                      {confidenceLabel[f.confidence]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {(conflicts > 0 || missing > 0) && (
            <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
              <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold mb-1">Data quality issues detected for this profile</p>
                <ul className="space-y-0.5">
                  {conflicts > 0 && <li>• {conflicts} conflicting field values across systems — manual resolution recommended</li>}
                  {missing > 0 && <li>• {missing} fields missing across one or more systems — may affect service delivery</li>}
                  {synced.size === 0 && <li>• Salesforce CRM last synced 48h+ ago — contact record may be outdated</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

