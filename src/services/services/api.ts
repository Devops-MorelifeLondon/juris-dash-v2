import {
  User,
  LoginCredentials,
  RegisterDetails,
  DashboardStats,
  TaskRequest,
  Task,
  TaskFilters,
  Case,
  CaseFilters,
  TrainingDocument,
  ChatThread,
  ChatMessage,
  PaginatedResponse,
  ParalegalProfile,
} from '@/types';
import {
  mockUsers,
  mockDashboardStats,
  mockTasks,
  mockCases,
  mockTrainingDocuments,
  mockChatThreads,
  mockChatMessages,
} from '@/lib/mockData';

// Export mockTasks and mockUsers for direct access if needed
export { mockTasks, mockUsers };

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock token generation
const generateToken = () => `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Authentication APIs
 */
export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  await delay();
  
  // Mock authentication - in real app, validate credentials against backend
  const user = mockUsers.find(u => u.email === credentials.email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return {
    user,
    token: generateToken(),
  };
}

export async function register(details: RegisterDetails): Promise<{ user: User; token: string }> {
  await delay();
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === details.email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const newUser: User = {
    id: `${mockUsers.length + 1}`,
    email: details.email,
    firstName: details.firstName,
    lastName: details.lastName,
    role: details.role,
    createdAt: new Date().toISOString(),
  };
  
  mockUsers.push(newUser);
  
  return {
    user: newUser,
    token: generateToken(),
  };
}

/**
 * Dashboard APIs
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  return mockDashboardStats;
}

export async function createTaskRequest(data: Omit<TaskRequest, 'id' | 'createdAt' | 'status'>): Promise<TaskRequest> {
  await delay();
  
  const newRequest: TaskRequest = {
    ...data,
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  
  return newRequest;
}

/**
 * Task APIs
 */
export async function getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
  await delay();
  
  let filteredTasks = [...mockTasks];
  
  // Apply filters
  if (filters?.status && filters.status.length > 0) {
    filteredTasks = filteredTasks.filter(task => filters.status!.includes(task.status));
  }
  
  if (filters?.priority && filters.priority.length > 0) {
    filteredTasks = filteredTasks.filter(task => filters.priority!.includes(task.priority));
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.caseName.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  if (filters?.sortBy) {
    filteredTasks.sort((a, b) => {
      const aValue = a[filters.sortBy!];
      const bValue = b[filters.sortBy!];
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      
      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
      return 0;
    });
  }
  
  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: filteredTasks.slice(startIndex, endIndex),
    total: filteredTasks.length,
    page,
    limit,
    totalPages: Math.ceil(filteredTasks.length / limit),
  };
}

export async function updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
  await delay();
  
  const task = mockTasks.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  
  task.status = status;
  task.updatedAt = new Date().toISOString();
  
  return task;
}

/**
 * Case APIs
 */
export async function getCases(filters?: CaseFilters): Promise<PaginatedResponse<Case>> {
  await delay();
  
  let filteredCases = [...mockCases];
  
  // Apply filters
  if (filters?.status && filters.status.length > 0) {
    filteredCases = filteredCases.filter(c => filters.status!.includes(c.status));
  }
  
  if (filters?.priority && filters.priority.length > 0) {
    filteredCases = filteredCases.filter(c => filters.priority!.includes(c.priority));
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredCases = filteredCases.filter(c =>
      c.caseNumber.toLowerCase().includes(searchLower) ||
      c.title.toLowerCase().includes(searchLower) ||
      c.clientName.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: filteredCases.slice(startIndex, endIndex),
    total: filteredCases.length,
    page,
    limit,
    totalPages: Math.ceil(filteredCases.length / limit),
  };
}

/**
 * Training Document APIs
 */
export async function getTrainingDocuments(): Promise<TrainingDocument[]> {
  await delay();
  return mockTrainingDocuments;
}

/**
 * Chat APIs
 */
export async function getChatThreads(): Promise<ChatThread[]> {
  await delay();
  return mockChatThreads;
}

export async function getChatMessages(threadId: string): Promise<ChatMessage[]> {
  await delay();
  return mockChatMessages[threadId] || [];
}

export async function postChatMessage(
  threadId: string,
  content: string,
  senderId: string,
  senderName: string
): Promise<ChatMessage> {
  await delay();
  
  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    threadId,
    senderId,
    senderName,
    content,
    sentAt: new Date().toISOString(),
    read: false,
  };
  
  if (!mockChatMessages[threadId]) {
    mockChatMessages[threadId] = [];
  }
  
  mockChatMessages[threadId].push(newMessage);
  
  // Update thread's last message
  const thread = mockChatThreads.find(t => t.id === threadId);
  if (thread) {
    thread.lastMessage = content;
    thread.lastMessageAt = newMessage.sentAt;
  }
  
  return newMessage;
}

export async function createChatThread(caseId: string, caseName: string, participants: string[]): Promise<ChatThread> {
  await delay();
  
  const newThread: ChatThread = {
    id: `thread-${Date.now()}`,
    caseId,
    caseName,
    participants,
    lastMessage: '',
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  };
  
  mockChatThreads.push(newThread);
  mockChatMessages[newThread.id] = [];
  
  return newThread;
}

/**
 * Profile APIs
 */
let mockProfile: ParalegalProfile | null = null;

export async function getProfile(userId: string): Promise<ParalegalProfile> {
  await delay();
  
  if (!mockProfile) {
    const user = mockUsers.find(u => u.id === userId);
    mockProfile = {
      id: `profile-${userId}`,
      userId,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      avatar: user?.avatar,
      headline: 'Experienced Paralegal specializing in Legal Research and Document Drafting',
      about: 'Dedicated paralegal professional with extensive experience in legal research, document preparation, and case management. Committed to providing exceptional support to legal teams.',
      specializations: ['Legal Research', 'Document Drafting', 'Case Management'],
      practiceAreas: ['Family Law', 'Personal Injury', 'Real Estate'],
      yearsOfExperience: 5,
      education: [
        {
          degree: 'Associate Degree in Paralegal Studies',
          institution: 'Boston University',
          graduationYear: 2019
        }
      ],
      certifications: [],
      hourlyRate: 45,
      availability: 'Available Now',
      workingHours: {
        timezone: 'America/New_York',
        schedule: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', available: true },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00', available: true },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00', available: true },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00', available: true },
          { day: 'Friday', startTime: '09:00', endTime: '17:00', available: true }
        ]
      },
      maxActiveCases: 10,
      currentActiveCases: 3,
      address: {
        street: '123 Legal Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        country: 'United States'
      },
      timezone: 'America/New_York',
      averageRating: 4.8,
      totalReviews: 24,
      totalCasesCompleted: 48,
      sopComplianceRate: 95,
      onTimeDeliveryRate: 98,
      totalEarnings: 45000,
      isPublicProfile: true,
      twoFactorEnabled: false,
      isVerified: true,
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  return mockProfile;
}

export async function updateProfile(userId: string, data: Partial<ParalegalProfile>): Promise<ParalegalProfile> {
  await delay();
  
  if (!mockProfile) {
    await getProfile(userId);
  }
  
  mockProfile = {
    ...mockProfile!,
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return mockProfile;
}

export async function toggleAvailability(userId: string): Promise<ParalegalProfile> {
  await delay();
  
  if (!mockProfile) {
    await getProfile(userId);
  }
  
  const availabilityStates: ParalegalProfile['availability'][] = [
    'Available Now',
    'Available Soon',
    'Fully Booked',
    'Not Available'
  ];
  
  const currentIndex = availabilityStates.indexOf(mockProfile!.availability);
  const nextIndex = (currentIndex + 1) % availabilityStates.length;
  
  mockProfile!.availability = availabilityStates[nextIndex];
  mockProfile!.updatedAt = new Date().toISOString();
  
  return mockProfile!;
}
