import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Gavel,
  ArrowLeft,
  Lock,
  ShieldCheck
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api/config";
import { useSearchParams } from "react-router-dom";

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  isStrong: boolean;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<ResetPasswordData>({
    password: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  
  const isProd = import.meta.env.VITE_PRODUCTION;

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid or missing reset token. Please request a new password reset.");
        return;
      }

      try {
        // Validate token existence (backend should have a validation endpoint)
        const response = await apiClient.get(`/api/attorney/auth/validate-reset-token/${token}`);
        
        if (response.data.success) {
          setIsValidToken(true);
        } else {
          setError("This reset link is invalid or has expired. Please request a new password reset.");
        }
      } catch (err: any) {
        console.error("Token validation error:", err);
        setError(err.response?.data?.message || "Invalid reset link. Please request a new password reset.");
      }
    };

    validateToken();
  }, [token]);

  // Password strength evaluation
  const evaluatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score++;
    } else {
      feedback.push("Use at least 8 characters");
    }

    // Uppercase letter check
    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push("Include uppercase letters");
    }

    // Lowercase letter check
    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push("Include lowercase letters");
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score++;
    } else {
      feedback.push("Include numbers");
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    } else {
      feedback.push("Include special characters");
    }

    let strengthText = "";
    let isStrong = false;

    if (score === 0 || score === 1) {
      strengthText = "Very Weak";
    } else if (score === 2) {
      strengthText = "Weak";
    } else if (score === 3) {
      strengthText = "Fair";
    } else if (score === 4) {
      strengthText = "Good";
      isStrong = true;
    } else {
      strengthText = "Strong";
      isStrong = true;
    }

    return {
      score,
      feedback: feedback.length > 0 ? feedback[0] : "Strong password!",
      isStrong
    };
  };

  // Update password strength on password change
  useEffect(() => {
    if (data.password) {
      const strength = evaluatePasswordStrength(data.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [data.password]);

  const getStrengthColor = (strength: PasswordStrength | null) => {
    if (!strength) return "bg-gray-200";
    switch (strength.score) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!data.password || data.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (!passwordStrength?.isStrong) {
      setError("Please create a stronger password.");
      return;
    }

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.put(
        `/api/attorney/auth/reset-password/${token}`,
        { password: data.password }
      );

      if (response.data.success) {
        setSuccess(
          "Your password has been successfully reset! You can now sign in with your new password."
        );
        setData({ password: "", confirmPassword: "" });
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to reset password");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth");
  };

  if (!isValidToken && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (error && !isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleBackToLogin}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                Secure Password Reset
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                Create a strong, secure password to protect your legal workflows and client data.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex gap-6 text-sm mt-12">
            <button className="text-blue-100 hover:text-white transition-colors">
              Security First
            </button>
            <button className="text-blue-100 hover:text-white transition-colors">
              Need Help?
            </button>
          </div>
        </div>

        {/* Right Side - Reset Password Form */}
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
                Reset Your Password
              </h2>
              <p className="text-gray-600 text-sm">
                Create a new password for your account. Make it strong and secure.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Back to Login Button */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleBackToLogin}
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>

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

              {/* Reset Password Form */}
              {!success && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="pl-10 pr-10"
                        value={data.password}
                        onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={8}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {passwordStrength && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Password Strength</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.isStrong ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {passwordStrength.feedback}
                          </span>
                        </div>
                        <div className="flex space-x-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          {[...Array(5)].map((_, index) => (
                            <div
                              key={index}
                              className={`h-full rounded-full transition-all ${
                                index < passwordStrength.score ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                              }`}
                              style={{ width: `${(1 / 5) * 100}%` }}
                            />
                          ))}
                        </div>
                        
                        {/* Password Requirements Checklist */}
                        <div className="space-y-1 mt-3">
                          {[
                            { check: data.password.length >= 8, text: "At least 8 characters", icon: ShieldCheck },
                            { check: /[A-Z]/.test(data.password), text: "One uppercase letter", icon: ShieldCheck },
                            { check: /[a-z]/.test(data.password), text: "One lowercase letter", icon: ShieldCheck },
                            { check: /[0-9]/.test(data.password), text: "One number", icon: ShieldCheck },
                            { check: /[^A-Za-z0-9]/.test(data.password), text: "One special character", icon: ShieldCheck }
                          ].map(({ check, text, icon: Icon }, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <Icon className={`h-3 w-3 ${check ? 'text-green-500' : 'text-gray-400'}`} />
                              <span className={`${check ? 'text-green-600' : 'text-gray-500'}`}>
                                {text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        className="pl-10 pr-10"
                        value={data.confirmPassword}
                        onChange={(e) => setData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {data.password && data.confirmPassword && data.password !== data.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={isLoading || !data.password || !data.confirmPassword || data.password !== data.confirmPassword || !passwordStrength?.isStrong}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Additional Information */}
              {!success && !error && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Security Tips:</span> Use a mix of uppercase, lowercase, numbers, and symbols for maximum security.
                    </p>
                    <p className="text-xs text-gray-500">
                      Your new password will replace your old one immediately.
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Links */}
              <div className="text-center pt-4">
                <button
                  className="text-sm text-gray-600 hover:text-blue-600 inline-flex items-center gap-1"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft className="h-3 w-3" />
                  Return to Sign In
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile-specific styling adjustment */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .min-h-screen {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
