import React, { useState, useEffect } from "react";
import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  Lock,
  Camera,
  Save,
  X,
  Edit3,
  AlertTriangle,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api/config";

// --- Type Definitions ---
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  firmName?: string;
  firmType?: "Solo Practice" | "Small Firm" | "Medium Firm" | "Large Firm";
  barNumber?: string;
  barState?: string;
  practiceAreas: string[];
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  timezone?: string;
  profileCompleted?: boolean;
  subscriptionPlan?: "Basic" | "Professional" | "Enterprise";
  subscriptionStatus?: "Active" | "Cancelled" | "Suspended" | "Trial";
  twoFactorEnabled?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

// --- API Service (Corrected) ---
// Note: Assuming your backend API returns an object like { success: boolean, data: UserProfile }
async function fetchProfile(): Promise<UserProfile> {
  try {
    const response = await apiClient.get(`/api/attorney/auth/me`);
    // Axios places the response body in `response.data`.
    // If your API wraps the profile in another 'data' object, access it like response.data.data.
    return response.data.data as UserProfile;
  } catch (error: any) {
    // Axios errors contain a 'response' object if the server replied
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch profile.";
    throw new Error(errorMessage);
  }
}

async function updateProfile(
  profileData: Partial<UserProfile>,
): Promise<UserProfile> {
  try {
    const response = await apiClient.put(
      `/api/attorney/auth/update-profile`,
      profileData,
    );
    return response.data.data as UserProfile;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update profile.";
    throw new Error(errorMessage);
  }
}

const practiceAreaOptions = [
  "Family Law",
  "Personal Injury",
  "Real Estate",
  "Estate Planning",
  "Intellectual Property",
  "Business Law",
  "Immigration Services",
  "Bankruptcy",
  "Criminal Law",
  "Tax Law",
  "Employment Law",
];

// --- Component ---
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      // The auth token is handled by the Axios interceptor, so no need to pass it.
      try {
        const data = await fetchProfile();
        setProfile(data);
        setEditedProfile(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation
      } catch (err: any) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Could not load profile.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(JSON.parse(JSON.stringify(profile))); // Reset changes with a deep copy
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!editedProfile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot save. No session found.",
      });
      return;
    }

    setIsSaving(true);

    const nameParts = editedProfile.fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    // Create a payload that matches the expected backend structure
    const payload = {
      ...editedProfile,
      firstName,
      lastName,
    };
    delete (payload as any).fullName; // Remove fullName if backend doesn't expect it

    try {
      const updatedData = await updateProfile(payload);
      setProfile(updatedData);
      setEditedProfile(JSON.parse(JSON.stringify(updatedData)));
      setIsEditing(false);
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    if (editedProfile) {
      setEditedProfile((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleNestedInputChange = (
    parent: "address",
    field: string,
    value: any,
  ) => {
    if (editedProfile) {
      setEditedProfile((prev) => ({
        ...prev!,
        [parent]: { ...(prev![parent] as any), [field]: value },
      }));
    }
  };

  const handleArrayToggle = (field: "practiceAreas", value: string) => {
    if (editedProfile) {
      setEditedProfile((prev) => {
        const currentArray = prev!.practiceAreas || [];
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value];
        return { ...prev!, [field]: newArray };
      });
    }
  };

  const getAvatarFallback = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Could not load profile</h2>
          <p className="text-muted-foreground">
            {error || "An unknown error occurred."}
          </p>
        </div>
      </Layout>
    );
  }

  const currentProfile = isEditing ? editedProfile! : profile;

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Profile Settings
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleEditToggle}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEditToggle}
                className="w-full sm:w-auto"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 space-y-6">
            <Card>
              <CardHeader className="text-center pb-6">
                <div className="relative inline-block">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto">
                    <AvatarImage src={currentProfile.avatar} />
                    <AvatarFallback className="text-lg sm:text-xl">
                      {getAvatarFallback(currentProfile.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="pt-4">
                  <h3 className="font-semibold text-lg sm:text-xl">
                    {currentProfile.fullName}
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    {currentProfile.firmName}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{currentProfile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{currentProfile.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="min-w-0">
                    <p className="break-words">{currentProfile.address.street}</p>
                    <p>
                      {currentProfile.address.city}, {currentProfile.address.state}{" "}
                      {currentProfile.address.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subscription Plan
                  </span>
                  <Badge variant="default">
                    {currentProfile.subscriptionPlan}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subscription Status
                  </span>
                  <Badge
                    variant={
                      currentProfile.subscriptionStatus === "Active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {currentProfile.subscriptionStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    2FA Status
                  </span>
                  <Badge
                    variant={
                      currentProfile.twoFactorEnabled ? "default" : "destructive"
                    }
                  >
                    {currentProfile.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Login</span>
                  <span className="text-sm font-medium">
                    {currentProfile.lastLogin
                      ? new Date(currentProfile.lastLogin).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-6">
                <TabsTrigger value="profile" className="text-xs sm:text-sm">
                  <User className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs sm:text-sm">
                  <Shield className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="text-xs sm:text-sm">
                  <CreditCard className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Subscription</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={currentProfile.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={currentProfile.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={currentProfile.phone || ""}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firmName">Firm Name</Label>
                        <Input
                          id="firmName"
                          value={currentProfile.firmName || ""}
                          onChange={(e) =>
                            handleInputChange("firmName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firmType">Firm Type</Label>
                        <Select
                          value={currentProfile.firmType || ""}
                          onValueChange={(value) =>
                            handleInputChange(
                              "firmType",
                              value as UserProfile["firmType"],
                            )
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select firm type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Solo Practice">
                              Solo Practice
                            </SelectItem>
                            <SelectItem value="Small Firm">Small Firm</SelectItem>
                            <SelectItem value="Medium Firm">
                              Medium Firm
                            </SelectItem>
                            <SelectItem value="Large Firm">Large Firm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="barNumber">Bar Number</Label>
                        <Input
                          id="barNumber"
                          value={currentProfile.barNumber || ""}
                          onChange={(e) =>
                            handleInputChange("barNumber", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="barState">Bar State</Label>
                        <Input
                          id="barState"
                          value={currentProfile.barState || ""}
                          onChange={(e) =>
                            handleInputChange("barState", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={currentProfile.address?.street || ""}
                        onChange={(e) =>
                          handleNestedInputChange("address", "street", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={currentProfile.address?.city || ""}
                          onChange={(e) =>
                            handleNestedInputChange("address", "city", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={currentProfile.address?.state || ""}
                          onChange={(e) =>
                            handleNestedInputChange("address", "state", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={currentProfile.address?.zipCode || ""}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "address",
                              "zipCode",
                              e.target.value,
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={currentProfile.address?.country || ""}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "address",
                              "country",
                              e.target.value,
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Practice Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {practiceAreaOptions.map((area) => (
                        <div key={area} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`practice-${area}`}
                            checked={currentProfile.practiceAreas.includes(area)}
                            onChange={() =>
                              handleArrayToggle("practiceAreas", area)
                            }
                            disabled={!isEditing}
                            className="rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`practice-${area}`}
                            className="text-xs sm:text-sm font-normal"
                          >
                            {area}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                      <Switch
                        checked={!!currentProfile.twoFactorEnabled}
                        onCheckedChange={(checked) =>
                          handleInputChange("twoFactorEnabled", checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">
                          Password Security
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        For security, you can change your password at any time.
                      </p>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Subscription Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">Current Plan</h4>
                        <p className="text-2xl font-bold">
                          {currentProfile.subscriptionPlan}
                        </p>
                      </div>
                      <div className="text-right">
                        <h4 className="font-medium">Status</h4>
                        <Badge
                          variant={
                            currentProfile.subscriptionStatus === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {currentProfile.subscriptionStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage your subscription, view invoices, and update
                        payment methods.
                      </p>
                      <Button variant="outline">Manage Subscription</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}

