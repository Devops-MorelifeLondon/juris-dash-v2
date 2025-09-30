export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  title: string;
  firmName: string;
  barNumber?: string;
  licenseNumber?: string;
  practiceAreas: string[];
  phone: string;
  agreeToTerms: boolean;
  agreeToCompliance: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'attorney' | 'cpa' | 'admin' | 'paralegal';
  firmName: string;
  avatar?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
}
