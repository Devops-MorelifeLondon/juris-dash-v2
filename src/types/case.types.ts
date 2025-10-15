// src/types/case.types.ts
export interface Case {
  _id: string;
  caseNumber: string;
  name: string;
  notes?: string;
  attorney: {
    _id: string;
    fullName: string;
    email: string;
    firmName?: string;
  };
  paralegal?: {
    _id: string;
    fullName: string;
    email: string;
  };
  client: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  serviceType: string;
  status: 'New' | 'Pending' | 'Accepted' | 'Declined' | 'In Progress' | 'Review' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: string;
  budget: number;
  agreedHourlyRate: number;
  actualHoursSpent: number;
  totalCost: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  assignmentDetails?: {
    requestedAt: string;
    respondedAt?: string;
    declineReason?: string;
  };
}

export interface CaseStats {
  totalCases: number;
  byStatus: Array<{
    _id: string;
    count: number;
    totalCost: number;
    totalHours: number;
  }>;
  byPriority: Array<{
    _id: string;
    count: number;
  }>;
  byServiceType: Array<{
    _id: string;
    count: number;
  }>;
}

export interface CreateCaseInput {
  caseNumber: string;
  name: string;
  client: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  serviceType: string;
  status?: string;
  priority?: string;
  deadline: string;
  budget?: number;
  agreedHourlyRate: number;
  notes?: string;
}
