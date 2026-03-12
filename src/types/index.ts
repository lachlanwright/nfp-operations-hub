export type MemberStatus = 'Submitted' | 'Needs Review' | 'Missing Info' | 'Approved' | 'CRM Synced';
export type MemberSource = 'Web Form' | 'Email' | 'Manual';

export interface MemberApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  memberType: string;
  source: MemberSource;
  status: MemberStatus;
  submittedAt: string;
  updatedAt: string;
  missingFields: string[];
  assignedTo?: string;
  notes?: string;
}

export type VolunteerAvailability = 'Weekdays' | 'Weekends' | 'Evenings' | 'Flexible';

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  availability: VolunteerAvailability;
  hoursPerWeek: number;
  source: 'HR System' | 'Signup Form' | 'Directory';
  location: string;
}

export type OpportunityUrgency = 'High' | 'Medium' | 'Low';

export interface Opportunity {
  id: string;
  title: string;
  program: string;
  description: string;
  requiredSkills: string[];
  topics: string[];
  hoursPerWeek: number;
  urgency: OpportunityUrgency;
}

export interface VolunteerMatch extends Volunteer {
  matchScore: number;
  matchReasons: string[];
}

export type SystemStatus = 'Synced' | 'Stale' | 'Error' | 'Pending';
export type SystemType = 'CRM' | 'Forms' | 'HR' | 'Directory' | 'Data Warehouse' | 'Email';

export interface SystemSource {
  id: string;
  name: string;
  type: SystemType;
  status: SystemStatus;
  lastSync: string;
  recordCount: number;
  issues?: string[];
}

export interface SourceField {
  label: string;
  value: string;
  source: string;
  confidence: 'high' | 'medium' | 'low' | 'conflict' | 'missing';
}

export interface UnifiedProfile {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  role: string;
  address: string;
  memberSince: string;
  fields: SourceField[];
}

export interface KPI {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  unit?: string;
  color?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'sync' | 'intake' | 'match' | 'alert' | 'approval';
  message: string;
  system?: string;
}
