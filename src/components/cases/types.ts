// @/components/cases/types.ts

export interface Client {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Attorney {
  _id: string;
  fullName: string;
  email: string;
  firmName?: string;
}

export interface Paralegal {
  _id: string;
  fullName: string;
  email: string;
}

export interface AssignmentDetails {
  assignedDate?: string;
  assignedBy?: string;
  notes?: string;
}

export interface Document {
  _id?: string;
  name: string;
  type: string;
  url?: string;
  status?: string;
  uploadedAt?: string;
}

export interface Case {
  _id: string;
  caseNumber: string;
  name: string;
  notes?: string;
  client: Client;
  attorney?: Attorney | string;
  paralegal?: Paralegal | string;
  assignmentDetails?: AssignmentDetails;
  serviceType: string;
  status: string;
  priority: string;
  deadline?: Date | string;
  budget?: number;
  agreedHourlyRate?: number;
  actualHoursSpent?: number;
  totalCost?: number;
  documents?: Document[];
  isArchived?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  __v?: number;
}

export type CaseStatus = 
  | "New" 
  | "In Progress" 
  | "Pending Review" 
  | "Completed" 
  | "On Hold";

export type CasePriority = "Low" | "Medium" | "High" | "Urgent";

export type ServiceType = 
  | "Immigration Services"
  | "Corporate Law"
  | "Family Law"
  | "Criminal Defense"
  | "Real Estate"
  | "Intellectual Property"
  | "Other";
