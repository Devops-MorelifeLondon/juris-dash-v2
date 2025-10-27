// src/types/task.types.ts

export interface Case {
  _id: string;
  name: string;
  caseNumber: string;
  serviceType: string;
  status: string;
  client?: any;
  deadline?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role?: 'attorney' | 'paralegal';
}

export interface ChecklistItem {
  _id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
 assignedBy: {fullName: string, email: string};
 assignedTo?: {fullName: string, email: string};

  type: 'Research' | 'Document Preparation' | 'Client Communication' | 'Court Filing' | 'Review' | 'Other';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHoursSpent?: number;
  checklistItems: ChecklistItem[];
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status: string;
  priority: string;
  type: string;
  caseId: string;
  search: string;
  page: number;
  limit: number;
}

export interface TaskStats {
  byStatus: Array<{
    _id: string;
    count: number;
    totalHours: number;
  }>;
  overdue: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  case?: string;
  assignedTo?: string;
  type: string;
  priority: string;
  dueDate: string;
  estimatedHours?: number;
  checklistItems: Array<{ text: string; completed: boolean }>;
  notes?: string;
  tags: string[];
}
