export interface Case {
  id: string;
  name: string;
  client: string;
  paralegal: string;
  status: "Open" | "In Progress" | "Closed";
  deadline: string;
  serviceType: string;
  documents: Document[];
  tasks: Task[];
  communications: Communication[];
}

export interface Document {
  id: string;
  title: string;
  aiSuggestions: string;
  sopCompliant: boolean;
}

export interface Task {
  id: string;
  description: string;
  timeSpentMinutes: number;
  completed: boolean;
}

export interface Communication {
  id: string;
  from: string;
  message: string;
  timestamp: string;
}
