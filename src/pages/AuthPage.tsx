import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Gavel
} from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setAttorney } from "@/store/attorneySlice";
import Cookies from "js-cookie";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { apiClient } from "@/lib/api/config";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dispatch = useDispatch();
  const isProd = import.meta.env.VITE_PRODUCTION;

  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    fullName: "",
    email: "",
    password: "",
    agreeToTerms: false
  });

  const handleGoogleAuth = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google authentication failed");
      }

      const response = await apiClient.post(
        `/api/attorney/auth/google-login`,
        {
          credential: credentialResponse.credential
        }
      );

      if (response.data.success) {
        const { email, fullName, token } = response.data.data;
        
        
        // FIXED: Proper cookie configuration for authentication
        Cookies.set('token', response.data.token || token, {
          expires: 7, // 7 days
          path: '/',
          secure: isProd, // Only secure in production
          sameSite: 'lax' // Changed from 'strict' to 'lax' for better compatibility
        });

        // Debug log
        console.log("✅ Token saved to cookie:", Cookies.get('token') ? 'SUCCESS' : 'FAILED');

        dispatch(setAttorney({ email, fullName }));
        
        setSuccess("Google login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else {
        setError(response.data.message || "Google login failed");
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  // Google One Tap Login
  useGoogleOneTapLogin({
    onSuccess: handleGoogleAuth,
    onError: () => setError("Google Login Failed")
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.post(
        `/api/attorney/auth/login`,
        loginData
      );

      if (response.data.success) {
        const { email, fullName, token } = response.data.data;
        
        // FIXED: Proper cookie configuration
        const authToken = response.data.token || token;
        
        Cookies.set('token', authToken, {
          expires: loginData.rememberMe ? 30 : 7, // 30 days if remember me, else 7 days
          path: '/',
          secure: isProd,
          sameSite: 'lax'
        });

        // Debug log
        console.log("✅ Login successful - Token saved:", Cookies.get('token') ? 'SUCCESS' : 'FAILED');
        console.log("🔍 Token preview:", authToken.substring(0, 20) + '...');

        dispatch(setAttorney({ email, fullName }));
        
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        throw new Error(response.data.message || "Invalid credentials");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (registerData.password.length < 8)
        throw new Error("Password must be at least 8 characters long");
      if (!registerData.agreeToTerms)
        throw new Error("Please agree to the Terms & Conditions");

      const response = await apiClient.post(
        `/api/attorney/auth/register`,
        registerData
      );

      if (response.data.success) {
        setSuccess(
          "Registration successful! Please check your email to verify your account."
        );
        setIsLogin(true);
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 to-blue-500 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <Gavel className="h-10 w-10 text-white" />
              <div>
                <h1 className="text-3xl font-bold">Juris-LPO</h1>
                <p className="text-blue-100 text-sm">
                  Legal Process Outsourcing
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                Empower Your Legal Workflows
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                Streamline your processes with our secure and intelligent
                LPO platform.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex gap-6 text-sm mt-12">
            <button className="text-blue-100 hover:text-white transition-colors">
              Discover More
            </button>
            <button className="text-blue-100 hover:text-white transition-colors">
              Contact Us
            </button>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex flex-col justify-center p-8 lg:p-12 bg-white">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Juris-LPO</h1>
              <p className="text-blue-600 text-sm">Legal Process Outsourcing</p>
            </div>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="text-center pb-6 pt-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Sign In" : "Create Your Account"}
              </h2>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Alerts */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="email">E-mail Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData((p) => ({
                            ...p,
                            password: e.target.value
                          }))
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={loginData.rememberMe}
                      onCheckedChange={(checked) =>
                        setLoginData((p) => ({
                          ...p,
                          rememberMe: checked as boolean
                        }))
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Remember Me
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleAuth}
                      onError={() => setError("Google Login Failed")}
                    />
                  </div>

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Don't have an account?{" "}
                      <span className="font-semibold text-blue-600">
                        Sign Up
                      </span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.fullName}
                      onChange={(e) =>
                        setRegisterData((p) => ({
                          ...p,
                          fullName: e.target.value
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="registerEmail">E-mail Address</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData((p) => ({
                          ...p,
                          email: e.target.value
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="registerPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData((p) => ({
                            ...p,
                            password: e.target.value
                          }))
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={registerData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setRegisterData((p) => ({
                          ...p,
                          agreeToTerms: checked as boolean
                        }))
                      }
                      required
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      I agree to{" "}
                      <span className="text-blue-600 hover:underline">
                        Terms & Conditions
                      </span>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>

                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleAuth}
                      onError={() => setError("Google Login Failed")}
                    />
                  </div>

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Already have an account?{" "}
                      <span className="font-semibold text-blue-600">
                        Sign In
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
