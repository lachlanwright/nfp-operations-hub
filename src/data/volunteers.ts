import type { Volunteer, Opportunity, VolunteerMatch } from '../types';

export const volunteers: Volunteer[] = [
  {
    id: 'V-001',
    name: 'Chloe Barker',
    email: 'chloe.barker@example.com',
    skills: ['Project Management', 'Fundraising', 'Event Coordination'],
    interests: ['Youth Services', 'Mental Health', 'Community Development'],
    availability: 'Weekends',
    hoursPerWeek: 6,
    source: 'HR System',
    location: 'Melbourne, VIC',
  },
  {
    id: 'V-002',
    name: 'James Okafor',
    email: 'j.okafor@example.com',
    skills: ['Data Analysis', 'Reporting', 'Excel', 'Stakeholder Engagement'],
    interests: ['Homelessness', 'Employment Support', 'Advocacy'],
    availability: 'Evenings',
    hoursPerWeek: 4,
    source: 'Signup Form',
    location: 'Melbourne, VIC',
  },
  {
    id: 'V-003',
    name: 'Mei Lin',
    email: 'mei.lin@example.com',
    skills: ['Social Work', 'Case Management', 'Multicultural Outreach'],
    interests: ['Refugee Support', 'Family Services', 'Cultural Programs'],
    availability: 'Flexible',
    hoursPerWeek: 8,
    source: 'Directory',
    location: 'Footscray, VIC',
  },
  {
    id: 'V-004',
    name: 'Ben Ostrowski',
    email: 'ben.o@example.com',
    skills: ['Web Development', 'UX Design', 'Digital Marketing'],
    interests: ['Education', 'Technology Access', 'Youth Services'],
    availability: 'Weekdays',
    hoursPerWeek: 5,
    source: 'Signup Form',
    location: 'Fitzroy, VIC',
  },
  {
    id: 'V-005',
    name: 'Sunita Patel',
    email: 'sunita.p@example.com',
    skills: ['Accounting', 'Grant Writing', 'Governance'],
    interests: ['Aged Care', 'Disability Support', 'Community Gardens'],
    availability: 'Weekdays',
    hoursPerWeek: 6,
    source: 'HR System',
    location: 'Brunswick, VIC',
  },
  {
    id: 'V-006',
    name: 'Lachlan Moore',
    email: 'lachlan.m@example.com',
    skills: ['Community Engagement', 'Fundraising', 'Event Coordination', 'Social Media'],
    interests: ['Mental Health', 'Youth Services', 'Sport and Recreation'],
    availability: 'Weekends',
    hoursPerWeek: 10,
    source: 'Signup Form',
    location: 'St Kilda, VIC',
  },
  {
    id: 'V-007',
    name: 'Amara Diallo',
    email: 'amara.d@example.com',
    skills: ['Legal Aid', 'Advocacy', 'Policy Research'],
    interests: ['Refugee Support', 'Homelessness', 'Human Rights'],
    availability: 'Evenings',
    hoursPerWeek: 4,
    source: 'Directory',
    location: 'Carlton, VIC',
  },
  {
    id: 'V-008',
    name: 'Takeshi Yamamoto',
    email: 'takeshi.y@example.com',
    skills: ['Project Management', 'Data Analysis', 'Stakeholder Engagement', 'Reporting'],
    interests: ['Employment Support', 'Multicultural Outreach', 'Community Development'],
    availability: 'Flexible',
    hoursPerWeek: 7,
    source: 'HR System',
    location: 'Richmond, VIC',
  },
];

export const opportunities: Opportunity[] = [
  {
    id: 'OPP-001',
    title: 'Youth Mental Health Program Coordinator',
    program: 'HeadsUp Youth Initiative',
    description: 'Coordinate weekly sessions and liaise with school partners for our youth mental health awareness program.',
    requiredSkills: ['Project Management', 'Event Coordination', 'Community Engagement'],
    topics: ['Mental Health', 'Youth Services'],
    hoursPerWeek: 6,
    urgency: 'High',
  },
  {
    id: 'OPP-002',
    title: 'Refugee Resettlement Case Support',
    program: 'New Horizons',
    description: 'Assist newly arrived refugees navigate housing, employment, and community services.',
    requiredSkills: ['Case Management', 'Multicultural Outreach', 'Advocacy'],
    topics: ['Refugee Support', 'Family Services'],
    hoursPerWeek: 5,
    urgency: 'High',
  },
  {
    id: 'OPP-003',
    title: 'Digital Inclusion Trainer',
    program: 'Connected Communities',
    description: 'Deliver workshops teaching basic digital skills to seniors and disadvantaged community members.',
    requiredSkills: ['Web Development', 'UX Design', 'Community Engagement'],
    topics: ['Technology Access', 'Education'],
    hoursPerWeek: 4,
    urgency: 'Medium',
  },
  {
    id: 'OPP-004',
    title: 'Fundraising Campaign Support',
    program: 'Annual Give Now Campaign',
    description: 'Support the annual fundraising campaign including events, donor communications, and social media.',
    requiredSkills: ['Fundraising', 'Event Coordination', 'Social Media'],
    topics: ['Community Development', 'Mental Health'],
    hoursPerWeek: 6,
    urgency: 'Medium',
  },
];

function computeMatch(volunteer: Volunteer, opportunity: Opportunity): VolunteerMatch {
  const reasons: string[] = [];
  let score = 0;

  const skillMatches = volunteer.skills.filter(s => opportunity.requiredSkills.includes(s));
  const topicMatches = volunteer.interests.filter(t => opportunity.topics.includes(t));

  score += skillMatches.length * 25;
  score += topicMatches.length * 20;

  if (volunteer.hoursPerWeek >= opportunity.hoursPerWeek) score += 15;
  else score -= 10;

  if (skillMatches.length > 0) reasons.push(`Skills match: ${skillMatches.join(', ')}`);
  if (topicMatches.length > 0) reasons.push(`Shared interest: ${topicMatches.join(', ')}`);
  if (volunteer.hoursPerWeek >= opportunity.hoursPerWeek) reasons.push(`Available ${volunteer.hoursPerWeek}h/wk (needs ${opportunity.hoursPerWeek}h)`);
  if (volunteer.availability === 'Flexible') reasons.push('Flexible availability');

  return { ...volunteer, matchScore: Math.min(99, Math.max(10, score)), matchReasons: reasons };
}

export function getMatchesForOpportunity(opportunityId: string, volunteerList: Volunteer[] = volunteers): VolunteerMatch[] {
  const opp = opportunities.find(o => o.id === opportunityId);
  if (!opp) return [];
  return volunteerList
    .map(v => computeMatch(v, opp))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}
