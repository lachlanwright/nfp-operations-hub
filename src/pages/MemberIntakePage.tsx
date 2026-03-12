import React, { useState } from 'react';
import {
  Search, Filter, AlertCircle, CheckCircle, RefreshCw, Send,
  X, ChevronRight, Clock, FileText, User, Building2, Mail, Phone, Info, Upload
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge, statusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CsvImportModal } from '../components/ui/CsvImportModal';
import { members as initialMembers } from '../data/members';
import type { MemberApplication, MemberStatus } from '../types';

const stageOrder: MemberStatus[] = ['Submitted', 'Needs Review', 'Missing Info', 'Approved', 'CRM Synced'];

const stageCount = (apps: MemberApplication[]) =>
  stageOrder.reduce((acc, s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {} as Record<MemberStatus, number>);

const stageColor: Record<MemberStatus, string> = {
  'Submitted': 'bg-slate-400',
  'Needs Review': 'bg-blue-500',
  'Missing Info': 'bg-amber-400',
  'Approved': 'bg-emerald-500',
  'CRM Synced': 'bg-indigo-500',
};

export const MemberIntakePage: React.FC = () => {
  const [apps, setApps] = useState<MemberApplication[]>(initialMembers);
  const [selected, setSelected] = useState<MemberApplication | null>(null);
  const [filter, setFilter] = useState<MemberStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showCsvModal, setShowCsvModal] = useState(false);

  const counts = stageCount(apps);

  const filtered = apps.filter(a => {
    const matchFilter = filter === 'All' || a.status === filter;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || a.organisation.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const updateStatus = (id: string, newStatus: MemberStatus, toastText: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a));
    setSelected(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
    showToast(toastText);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle size={16} className="text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <CsvImportModal<MemberApplication>
          title="Import Members"
          description="Upload a CSV file to bulk-import member applications."
          templateHeaders={['name','email','phone','organisation','memberType','source','notes']}
          templateRows={[
            ['Jane Smith','jane@example.org','0411 222 333','Example NFP','Full Member','Web Form','Referred by board member'],
            ['Tom Jones','tom@nonprofit.org.au','0422 444 555','Another NFP','Associate Member','Email',''],
          ]}
          parseRow={(row, i) => {
            if (!row['name'] || !row['email']) return { error: 'Missing required fields: name, email' };
            return {
              id: `CSV-${Date.now()}-${i}`,
              name: row['name'],
              email: row['email'],
              phone: row['phone'] || '',
              organisation: row['organisation'] || '',
              memberType: row['memberType'] || 'Full Member',
              source: (row['source'] as MemberApplication['source']) || 'Manual',
              status: 'Submitted',
              submittedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              missingFields: [],
              notes: row['notes'] || undefined,
            } satisfies MemberApplication;
          }}
          onImport={(records) => {
            setApps(prev => [...records, ...prev]);
            showToast(`${records.length} member${records.length !== 1 ? 's' : ''} imported successfully`);
          }}
          onClose={() => setShowCsvModal(false)}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Member Intake Workbench</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Unified view of member applications across email, web forms, and manual entry</p>
        </div>
        <Button variant="secondary" size="md" icon={<Upload size={14} />} onClick={() => setShowCsvModal(true)}>
          Import CSV
        </Button>
      </div>

      {/* Stage pipeline */}
      <Card>
        <div className="flex divide-x divide-slate-100 dark:divide-slate-700">
          {stageOrder.map(stage => (
            <button
              key={stage}
              onClick={() => setFilter(f => f === stage ? 'All' : stage)}
              className={`flex-1 py-4 px-3 text-center group transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${filter === stage ? 'bg-slate-50 dark:bg-slate-700' : ''}`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${stageColor[stage]}`} />
                <span className={`text-xs font-medium ${filter === stage ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>{stage}</span>
              </div>
              <p className={`text-2xl font-bold ${stage === 'Missing Info' && counts[stage] > 0 ? 'text-amber-500' : 'text-slate-800 dark:text-slate-100'}`}>
                {counts[stage]}
              </p>
              {stage === 'Missing Info' && counts[stage] > 0 && (
                <p className="text-xs text-amber-500 mt-0.5 flex items-center justify-center gap-0.5">
                  <AlertCircle size={11} /> Bottleneck
                </p>
              )}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex gap-4">
        {/* Table */}
        <div className={`flex-1 min-w-0 transition-all ${selected ? 'w-3/5' : 'w-full'}`}>
          <Card>
            <CardHeader
              title={`Applications ${filter !== 'All' ? `— ${filter}` : ''}`}
              subtitle={`${filtered.length} of ${apps.length} shown`}
              action={
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                  </div>
                  <Button variant="ghost" size="sm" icon={<Filter size={13} />}>Filter</Button>
                </div>
              }
            />
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                <div className="col-span-3">Applicant</div>
                <div className="col-span-3">Organisation</div>
                <div className="col-span-2">Source</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Submitted</div>
              </div>
              {filtered.map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelected(s => s?.id === app.id ? null : app)}
                  className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-950 ${selected?.id === app.id ? 'bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-500' : ''}`}
                >
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{app.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{app.email}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{app.organisation}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{app.memberType}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded px-2 py-0.5">{app.source}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="space-y-1">
                      <Badge label={app.status} variant={statusVariant(app.status)} />
                      {app.missingFields.length > 0 && (
                        <p className="text-xs text-amber-600 flex items-center gap-0.5">
                          <AlertCircle size={10} /> {app.missingFields.length} missing
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(app.submittedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No applications match your filter.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 shrink-0">
            <Card className="sticky top-4">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{selected.id}</p>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">{selected.name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status</span>
                  <Badge label={selected.status} variant={statusVariant(selected.status)} size="md" />
                </div>

                {/* Workflow bar */}
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Workflow progress</p>
                  <div className="flex gap-1">
                    {stageOrder.map((stage, i) => {
                      const currentIdx = stageOrder.indexOf(selected.status);
                      const isPast = i < currentIdx;
                      const isCurrent = i === currentIdx;
                      return (
                        <div key={stage} className="flex-1 text-center">
                          <div className={`h-1.5 rounded-full ${isPast ? 'bg-emerald-400' : isCurrent ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-600'}`} />
                          {isCurrent && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-0.5" />}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-blue-600 font-medium mt-1.5">{selected.status}</p>
                </div>

                {/* Fields */}
                <div className="space-y-2.5">
                  {[
                    { icon: <User size={13} />, label: 'Name', value: selected.name },
                    { icon: <Mail size={13} />, label: 'Email', value: selected.email },
                    { icon: <Phone size={13} />, label: 'Phone', value: selected.phone },
                    { icon: <Building2 size={13} />, label: 'Org', value: selected.organisation },
                    { icon: <FileText size={13} />, label: 'Type', value: selected.memberType },
                    { icon: <Info size={13} />, label: 'Source', value: selected.source },
                    { icon: <Clock size={13} />, label: 'Submitted', value: new Date(selected.submittedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  ].map(f => (
                    <div key={f.label} className="flex items-start gap-2">
                      <span className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">{f.icon}</span>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{f.label}</p>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Assigned */}
                {selected.assignedTo && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Assigned to</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{selected.assignedTo}</p>
                  </div>
                )}

                {/* Notes */}
                {selected.notes && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Notes</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{selected.notes}</p>
                  </div>
                )}

                {/* Missing fields */}
                {selected.missingFields.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <p className="text-xs text-amber-700 font-semibold mb-2 flex items-center gap-1">
                      <AlertCircle size={12} /> Missing information
                    </p>
                    <ul className="space-y-1">
                      {selected.missingFields.map(f => (
                        <li key={f} className="text-xs text-amber-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actions</p>
                  {selected.missingFields.length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      icon={<Send size={13} />}
                      onClick={() => updateStatus(selected.id, 'Needs Review', `Info request sent to ${selected.name}`)}
                    >
                      Request Missing Info
                    </Button>
                  )}
                  {(selected.status === 'Needs Review' || selected.status === 'Submitted') && (
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full"
                      icon={<CheckCircle size={13} />}
                      onClick={() => updateStatus(selected.id, 'Approved', `${selected.name} approved successfully`)}
                    >
                      Approve Application
                    </Button>
                  )}
                  {selected.status === 'Approved' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      icon={<RefreshCw size={13} />}
                      onClick={() => updateStatus(selected.id, 'CRM Synced', `${selected.name} synced to CRM`)}
                    >
                      Sync to CRM
                    </Button>
                  )}
                  {selected.status === 'CRM Synced' && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-3 py-2">
                      <CheckCircle size={13} /> Record fully synced to CRM
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
