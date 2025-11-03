import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Gavel,
  ArrowLeft,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api/config";

interface ForgotPasswordData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [data, setData] = useState<ForgotPasswordData>({
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false); // Not used but keeping for consistency
  const navigate = useNavigate();
  const isProd = import.meta.env.VITE_PRODUCTION;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.post(
        `/api/attorney/auth/forgot-password`,
        data
      );

      if (response.data.success) {
        setSuccess(
          "Password reset email sent! Check your inbox for instructions to reset your password."
        );
        setData({ email: "" }); // Clear form on success
      } else {
        throw new Error(response.data.message || "Failed to send reset email");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth");
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
                Secure Password Recovery
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                We've got you covered. Reset your password quickly and securely to get back to managing your legal workflows.
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

        {/* Right Side - Forgot Password Form */}
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
                Forgot Password
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your email address and we'll send you a link to reset your password.
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
                    <div className="mt-2 text-sm text-green-700 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Check your spam folder if you don't see the email within 5 minutes.</span>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your registered email"
                      className="pl-10"
                      value={data.email}
                      onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={isLoading || !!success}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send a secure reset link to this email address.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  disabled={isLoading || !data.email.trim() || !!success}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Reset Email...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>

              {/* Additional Information */}
              <div className="pt-6 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">How it works:</span> We'll send you an email with a secure link that expires in 30 minutes.
                  </p>
                  <p className="text-xs text-gray-500">
                    Make sure you have access to this email address to reset your password.
                  </p>
                </div>
              </div>

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
