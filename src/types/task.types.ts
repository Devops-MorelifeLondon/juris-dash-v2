// src/types/task.types.ts
export interface Task {
  _id: string;
  title: string;
  description: string;
  case?: {
    _id: string;
    name: string;
    caseNumber: string;
    serviceType: string;
  };
  assignedBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    fullName: string;
    email: string;
  };
  demoAssignedTo?: string;
  type: 'Drafting' | 'Research' | 'Review' | 'Filing' | 'Communication' | 'Administrative' | 'Other';
  status: 'Not Started' | 'In Progress' | 'Blocked' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHoursSpent: number;
  checklistItems?: Array<{
    _id: string;
    text: string;
    completed: boolean;
    completedAt?: string;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    uploadedAt: string;
  }>;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
