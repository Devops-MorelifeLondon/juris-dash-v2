import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Building2, 
  Phone, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Gavel,
  ArrowRight,
  Users,
  ChevronDown,
  Award,
  Globe,
  Clock
} from "lucide-react";
import { LoginCredentials, RegisterData } from "./types";

const practiceAreas = [
  "Family Law", "Personal Injury", "Real Estate", "Estate Planning",
  "Intellectual Property", "Business Law", "Immigration", "Bankruptcy",
  "Criminal Law", "Tax Law", "Employment Law", "Healthcare Law"
];

const professionalTitles = [
  "Attorney", "Partner", "Associate", "Of Counsel", "Solo Practitioner",
  "CPA", "Tax Advisor", "Financial Consultant", "Accounting Manager"
];

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPracticeAreas, setShowPracticeAreas] = useState(false);

  // Login State
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false
  });

  // Register State  
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    title: "",
    firmName: "",
    barNumber: "",
    licenseNumber: "",
    practiceAreas: [],
    phone: "",
    agreeToTerms: false,
    agreeToCompliance: false
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (loginData.email === "demo@juris-lpo.com" && loginData.password === "demo123") {
        setSuccess("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (registerData.password !== registerData.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      if (registerData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (!registerData.agreeToTerms || !registerData.agreeToCompliance) {
        throw new Error("Please agree to all terms and compliance requirements");
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess("Registration successful! Please check your email to verify your account.");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePracticeAreaToggle = (area: string) => {
    setRegisterData(prev => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter(a => a !== area)
        : [...prev.practiceAreas, area]
    }));
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Desktop: h-screen grid, Mobile: flex column */}
      <div className="h-full lg:grid lg:grid-cols-5">
        
        {/* Left Side - Professional Branding (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-2 lg:flex-col lg:justify-center lg:bg-gray-900 lg:text-white lg:p-12">
          <div className="max-w-md">
            {/* Logo & Brand */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center">
                  <Gavel className="h-7 w-7 text-gray-900" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Juris-LPO</h1>
                  <p className="text-gray-300">Legal Process Outsourcing</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                Professional Legal Outsourcing Platform
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Trusted by 500+ law firms and CPA practices. Secure, efficient, 
                and fully compliant legal support services.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-4 mb-8">
              {[
                { 
                  icon: Shield, 
                  title: "Enterprise Security", 
                  desc: "ABA, HIPAA, and GDPR compliant"
                },
                { 
                  icon: Users, 
                  title: "Dedicated Paralegals", 
                  desc: "Professional legal support teams"
                },
                { 
                  icon: Clock, 
                  title: "24/7 Support", 
                  desc: "Round-the-clock assistance"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-gray-400 text-xs">Law Firms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-gray-400 text-xs">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-xs">Support</div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Shield, text: "ABA Compliant" },
                { icon: Award, text: "SOC 2 Type II" },
                { icon: Globe, text: "GDPR Ready" },
                { icon: CheckCircle, text: "HIPAA Secure" }
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-800 rounded-full px-3 py-1">
                  <badge.icon className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-300 text-xs">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:col-span-3 flex flex-col justify-start h-full">
          {/* Mobile Header */}
          <div className="lg:hidden px-6 pt-6 pb-4 bg-white border-b">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-10 w-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Juris-LPO</h1>
                  <p className="text-sm text-gray-600">Legal Process Outsourcing</p>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Secure
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Compliant
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Trusted
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form Container - Fixed Height */}
          <div className="flex-1 lg:flex lg:items-center lg:justify-center lg:p-8 bg-white overflow-hidden">
            <div className="w-full max-w-md mx-auto px-6 py-6 lg:px-0 lg:py-0 h-full lg:h-auto flex flex-col lg:block">
              <Card className="flex-1 lg:flex-none shadow-lg border bg-white">
                <CardHeader className="text-center pb-6 pt-6 lg:pt-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {activeTab === "login" ? "Welcome Back" : "Create Account"}
                  </CardTitle>
                  <p className="text-gray-600">
                    {activeTab === "login" 
                      ? "Access your professional dashboard" 
                      : "Join the legal outsourcing platform"
                    }
                  </p>
                </CardHeader>
                
                <CardContent className="px-6 pb-6 lg:px-8 lg:pb-8 flex-1 flex flex-col">
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg h-12">
                      <TabsTrigger 
                        value="login" 
                        className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 font-medium"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger 
                        value="register" 
                        className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 font-medium"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    {/* Error/Success Messages */}
                    {error && (
                      <Alert className="mb-4 border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="mb-4 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}

                    {/* Login Form */}
                    <TabsContent value="login" className="flex-1 flex flex-col space-y-4">
                      <form onSubmit={handleLogin} className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="attorney@lawfirm.com"
                              value={loginData.email}
                              onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                              className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={loginData.password}
                              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                              className="pl-10 pr-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remember"
                              checked={loginData.rememberMe}
                              onCheckedChange={(checked) => 
                                setLoginData(prev => ({ ...prev, rememberMe: checked as boolean }))
                              }
                              className="rounded"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-700">
                              Remember me
                            </label>
                          </div>
                          <Button variant="link" className="px-0 h-auto text-sm text-gray-900 hover:text-gray-700">
                            Forgot password?
                          </Button>
                        </div>

                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Signing In...
                              </>
                            ) : (
                              <>
                                Access Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Demo Credentials */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                          <p className="text-sm font-medium text-gray-900 mb-2">Demo Account:</p>
                          <div className="grid grid-cols-1 gap-1 text-sm text-gray-700">
                            <div>Email: <code className="font-mono">demo@juris-lpo.com</code></div>
                            <div>Password: <code className="font-mono">demo123</code></div>
                          </div>
                        </div>
                      </form>
                    </TabsContent>

                    {/* Registration Form */}
                    <TabsContent value="register" className="flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                        <form onSubmit={handleRegister} className="space-y-4">
                          {/* Personal Info */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                First Name
                              </Label>
                              <Input
                                id="firstName"
                                placeholder="John"
                                value={registerData.firstName}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                                className="h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                Last Name
                              </Label>
                              <Input
                                id="lastName"
                                placeholder="Smith"
                                value={registerData.lastName}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                                className="h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="registerEmail" className="text-sm font-medium text-gray-700">
                              Email Address
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="registerEmail"
                                type="email"
                                placeholder="attorney@lawfirm.com"
                                value={registerData.email}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                className="pl-10 h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                              Phone Number
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={registerData.phone}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                                className="pl-10 h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                                required
                              />
                            </div>
                          </div>

                          {/* Professional Info */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                Title
                              </Label>
                              <Select 
                                value={registerData.title} 
                                onValueChange={(value) => setRegisterData(prev => ({ ...prev, title: value }))}
                              >
                                <SelectTrigger className="h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {professionalTitles.map(title => (
                                    <SelectItem key={title} value={title}>{title}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="firmName" className="text-sm font-medium text-gray-700">
                                Firm Name
                              </Label>
                              <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="firmName"
                                  placeholder="Smith & Associates"
                                  value={registerData.firmName}
                                  onChange={(e) => setRegisterData(prev => ({ ...prev, firmName: e.target.value }))}
                                  className="pl-10 h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Credentials */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="barNumber" className="text-sm font-medium text-gray-700">
                                Bar Number
                              </Label>
                              <Input
                                id="barNumber"
                                placeholder="TX123456"
                                value={registerData.barNumber}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, barNumber: e.target.value }))}
                                className="h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700">
                                CPA License
                              </Label>
                              <Input
                                id="licenseNumber"
                                placeholder="CPA987654"
                                value={registerData.licenseNumber}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                                className="h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                              />
                            </div>
                          </div>

                          {/* Practice Areas */}
                          <div className="space-y-1">
                            <Label className="text-sm font-medium text-gray-700">
                              Practice Areas
                            </Label>
                            <div className="space-y-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPracticeAreas(!showPracticeAreas)}
                                className="w-full h-10 justify-between border-gray-300 hover:border-gray-400 rounded-lg"
                              >
                                <span className="text-gray-700">
                                  {registerData.practiceAreas.length === 0 
                                    ? "Select areas" 
                                    : `${registerData.practiceAreas.length} selected`
                                  }
                                </span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${showPracticeAreas ? 'rotate-180' : ''}`} />
                              </Button>
                              
                              {showPracticeAreas && (
                                <div className="grid grid-cols-2 gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
                                  {practiceAreas.map(area => (
                                    <div key={area} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={area}
                                        checked={registerData.practiceAreas.includes(area)}
                                        onCheckedChange={() => handlePracticeAreaToggle(area)}
                                        className="rounded"
                                      />
                                      <label htmlFor={area} className="text-xs text-gray-700 cursor-pointer">
                                        {area}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Password Fields */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="registerPassword" className="text-sm font-medium text-gray-700">
                                Password
                              </Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="registerPassword"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="8+ characters"
                                  value={registerData.password}
                                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                                  className="pl-10 pr-10 h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm Password
                              </Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="confirmPassword"
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Re-enter"
                                  value={registerData.confirmPassword}
                                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  className="pl-10 pr-10 h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900/10 rounded-lg"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Agreements */}
                          <div className="space-y-3">
                            <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                              <Checkbox
                                id="terms"
                                checked={registerData.agreeToTerms}
                                onCheckedChange={(checked) => 
                                  setRegisterData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                                }
                                className="rounded mt-0.5"
                                required
                              />
                              <label htmlFor="terms" className="text-sm text-gray-700">
                                I agree to the <Button variant="link" className="h-auto p-0 text-sm underline text-gray-900">Terms of Service</Button> and <Button variant="link" className="h-auto p-0 text-sm underline text-gray-900">Privacy Policy</Button>
                              </label>
                            </div>

                            <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                              <Checkbox
                                id="compliance"
                                checked={registerData.agreeToCompliance}
                                onCheckedChange={(checked) => 
                                  setRegisterData(prev => ({ ...prev, agreeToCompliance: checked as boolean }))
                                }
                                className="rounded mt-0.5"
                                required
                              />
                              <label htmlFor="compliance" className="text-sm text-gray-700">
                                I acknowledge compliance with <span className="font-medium">ABA Model Rules</span>, <span className="font-medium">HIPAA</span>, and <span className="font-medium">GDPR</span> requirements
                              </label>
                            </div>
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Creating Account...
                              </>
                            ) : (
                              <>
                                Create Account
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </form>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Mobile Footer */}
              <div className="lg:hidden mt-4 text-center">
                <p className="text-sm text-gray-600 mb-3">Trusted by 500+ Legal Professionals</p>
                <div className="flex justify-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    ABA Compliant
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    HIPAA Secure
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
