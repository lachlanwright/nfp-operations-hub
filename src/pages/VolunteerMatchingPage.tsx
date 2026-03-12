import React, { useState } from 'react';
import { Zap, Clock, MapPin, CheckCircle, Users, Star, AlertTriangle, Upload } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CsvImportModal } from '../components/ui/CsvImportModal';
import { opportunities, getMatchesForOpportunity, volunteers as initialVolunteers } from '../data/volunteers';
import type { VolunteerMatch, OpportunityUrgency, Volunteer } from '../types';

const urgencyVariant: Record<OpportunityUrgency, 'error' | 'warning' | 'gray'> = {
  High: 'error',
  Medium: 'warning',
  Low: 'gray',
};

const sourceColor: Record<string, string> = {
  'HR System': 'bg-purple-50 text-purple-700',
  'Signup Form': 'bg-blue-50 text-blue-700',
  'Directory': 'bg-slate-100 text-slate-600',
};

export const VolunteerMatchingPage: React.FC = () => {
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0].id);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [extraVolunteers, setExtraVolunteers] = useState<Volunteer[]>([]);

  const selectedOpp = opportunities.find(o => o.id === selectedOppId)!;
  const matches: VolunteerMatch[] = getMatchesForOpportunity(selectedOppId, [...initialVolunteers, ...extraVolunteers]);

  const handleAssign = (volunteer: VolunteerMatch) => {
    setAssigned(prev => new Set([...prev, `${selectedOppId}:${volunteer.id}`]));
    setToastMsg(`${volunteer.name} assigned to "${selectedOpp.title}"`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isAssigned = (vid: string) => assigned.has(`${selectedOppId}:${vid}`);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <CsvImportModal<Volunteer>
          title="Import Volunteers"
          description="Upload a CSV file to bulk-import volunteers into the matching pool."
          templateHeaders={['name','email','skills','interests','availability','hoursPerWeek','location']}
          templateRows={[
            ['Alex Brown','alex@example.com','Project Management,Fundraising','Youth Services,Mental Health','Weekends','6','Melbourne VIC'],
            ['Sam Lee','sam@example.com','Data Analysis,Reporting','Homelessness,Advocacy','Evenings','4','Carlton VIC'],
          ]}
          parseRow={(row, i) => {
            if (!row['name'] || !row['email']) return { error: 'Missing required fields: name, email' };
            const hours = parseInt(row['hoursPerWeek'] || '4');
            return {
              id: `CSV-V-${Date.now()}-${i}`,
              name: row['name'],
              email: row['email'],
              skills: row['skills'] ? row['skills'].split(';').concat(row['skills'].split(',')).filter((s, idx, arr) => s && arr.indexOf(s) === idx) : [],
              interests: row['interests'] ? row['interests'].split(';').concat(row['interests'].split(',')).filter((s, idx, arr) => s && arr.indexOf(s) === idx) : [],
              availability: (row['availability'] as Volunteer['availability']) || 'Flexible',
              hoursPerWeek: isNaN(hours) ? 4 : hours,
              source: 'Signup Form',
              location: row['location'] || '',
            } satisfies Volunteer;
          }}
          onImport={(records) => {
            setExtraVolunteers(prev => [...prev, ...records]);
            setToastMsg(`${records.length} volunteer${records.length !== 1 ? 's' : ''} added to matching pool`);
          }}
          onClose={() => setShowCsvModal(false)}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Volunteer Matching</h2>
          <p className="text-sm text-slate-500 mt-0.5">Skill-based and interest-based matching across all registered volunteers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" icon={<Upload size={14} />} onClick={() => setShowCsvModal(true)}>
            Import CSV
          </Button>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700">
            <Zap size={13} />
            <span className="font-medium">AI-assisted matching · {opportunities.length} open opportunities</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Opportunity list */}
        <div className="col-span-2 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">Open Opportunities</p>
          {opportunities.map(opp => (
            <Card
              key={opp.id}
              onClick={() => setSelectedOppId(opp.id)}
              className={`transition-all ${selectedOppId === opp.id ? 'border-blue-400 shadow-md ring-1 ring-blue-200' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-slate-800 leading-snug">{opp.title}</h4>
                  <Badge label={opp.urgency} variant={urgencyVariant[opp.urgency]} />
                </div>
                <p className="text-xs text-indigo-600 font-medium mb-2">{opp.program}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{opp.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {opp.topics.map(t => (
                    <span key={t} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock size={11} /> {opp.hoursPerWeek}h/week</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {getMatchesForOpportunity(opp.id).length} matches</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Match results */}
        <div className="col-span-3">
          <Card>
            <CardHeader
              title={`Matches for: ${selectedOpp.title}`}
              subtitle={`${matches.length} ranked by skill + interest alignment`}
              action={
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Score = Skills + Interests + Availability
                </div>
              }
            />

            {/* Skills needed */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-1.5 items-center">
              <span className="text-xs font-medium text-slate-500 mr-1">Required skills:</span>
              {selectedOpp.requiredSkills.map(s => (
                <span key={s} className="text-xs bg-white border border-slate-300 text-slate-600 rounded-full px-2 py-0.5">{s}</span>
              ))}
            </div>

            <div className="divide-y divide-slate-50">
              {matches.map((v, i) => (
                <div key={v.id} className={`p-5 ${i === 0 ? 'bg-emerald-50/40' : ''}`}>
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? 'bg-emerald-500 text-white' : i === 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {i === 0 ? <Star size={13} /> : i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-800">{v.name}</h4>
                        {i === 0 && <span className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-medium">Best match</span>}
                        <span className={`text-xs rounded px-2 py-0.5 ${sourceColor[v.source]}`}>{v.source}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><MapPin size={11} />{v.location}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{v.availability} · {v.hoursPerWeek}h/wk</span>
                      </div>

                      {/* Match score bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-500">Match score</span>
                          <span className={`text-sm font-bold ${v.matchScore >= 80 ? 'text-emerald-600' : v.matchScore >= 50 ? 'text-blue-600' : 'text-slate-500'}`}>
                            {v.matchScore}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${v.matchScore >= 80 ? 'bg-emerald-500' : v.matchScore >= 50 ? 'bg-blue-500' : 'bg-slate-400'}`}
                            style={{ width: `${v.matchScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Match reasons */}
                      {v.matchReasons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {v.matchReasons.map(r => (
                            <span key={r} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                              <CheckCircle size={10} /> {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5">
                        {v.skills.map(s => {
                          const isMatch = selectedOpp.requiredSkills.includes(s);
                          return (
                            <span key={s} className={`text-xs rounded-full px-2 py-0.5 ${isMatch ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium' : 'bg-slate-100 text-slate-500'}`}>
                              {s}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {isAssigned(v.id) ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                          <CheckCircle size={13} /> Assigned
                        </div>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => handleAssign(v)}>
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>

                  {v.matchScore < 40 && (
                    <div className="mt-3 ml-11 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                      <AlertTriangle size={12} /> Low match — consider skills gap before assigning
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
