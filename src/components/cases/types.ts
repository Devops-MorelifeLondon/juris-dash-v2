export interface Case {
  id: string;
  name: string;
  client: string;
  paralegal: string;
  status: "Open" | "In Progress" | "Review" | "Closed";
  deadline: string;
  serviceType: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  documents: Document[];
  tasks: Task[];
  communications: Communication[];
  timeSpent: number; // in hours
  budget?: number;
  notes?: string;
  createdDate: string;
  lastUpdated: string;
}

export interface Document {
  id: string;
  title: string;
  type: "Draft" | "Final" | "Template" | "Research";
  aiSuggestions: string;
  sopCompliant: boolean;
  uploadDate: string;
  paralegalName: string;
  revisionCount: number;
  fileSize?: string;
  status: "Pending Review" | "Approved" | "Needs Revision";
}

export interface Task {
  id: string;
  description: string;
  type: "Drafting" | "Research" | "Filing" | "Communication" | "Review";
  timeSpentMinutes: number;
  completed: boolean;
  dueDate?: string;
  paralegalAssigned: string;
  priority: "Low" | "Medium" | "High";
  aiAssisted: boolean;
}

export interface Communication {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  type: "Internal" | "Client" | "Court" | "Vendor";
  attachments?: string[];
}
