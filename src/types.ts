export type BranchType = 'Moon' | 'Light' | 'Forge' | 'Booking';

export type LeadStatus = 'Nouveau' | 'En cours' | 'Signé' | 'Archivé';

export interface WizardAnswers {
  projectType: string;
  maturity: string;
  ambition: string;
  criticalNeed: string;
}

export interface Lead {
  id?: string;
  created_at?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  branch: BranchType;
  answers?: WizardAnswers;
  summary: string;
  status: LeadStatus;
  booking_date?: string;
  booking_time?: string;
  booking_notes?: string;
}

