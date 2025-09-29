import React, { useState } from "react";
import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Shield, 
  Bell, 
  CreditCard,
  Lock,
  Camera,
  Save,
  X,
  Edit3,
  Check,
  AlertTriangle,
  Globe,
  FileText
} from "lucide-react";

 interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string; // Attorney, CPA, Partner, etc.
  firmName: string;
  barNumber?: string;
  licenseNumber?: string;
  practiceAreas: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar?: string;
  timezone: string;
  preferredCommunication: 'email' | 'phone' | 'sms';
  billingPreferences: {
    invoiceFrequency: 'monthly' | 'weekly' | 'per-project';
    paymentMethod: string;
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    sessionTimeout: number;
  };
  complianceSettings: {
    enabledStandards: string[];
    sopPreferences: string[];
    documentTemplates: string[];
  };
  createdAt: string;
  lastLogin: string;
}


const initialProfile: UserProfile = {
  id: "user-001",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@lawfirm.com",
  phone: "+1 (555) 123-4567",
  title: "Senior Partner",
  firmName: "Smith & Associates Law Firm",
  barNumber: "TX123456",
  licenseNumber: "CPA987654",
  practiceAreas: ["Family Law", "Personal Injury", "Real Estate"],
  address: {
    street: "123 Main Street, Suite 456",
    city: "Houston",
    state: "Texas",
    zipCode: "77001",
    country: "United States"
  },
  avatar: "/api/placeholder/150/150",
  timezone: "America/Chicago",
  preferredCommunication: "email",
  billingPreferences: {
    invoiceFrequency: "monthly",
    paymentMethod: "Credit Card",
    billingAddress: {
      street: "123 Main Street, Suite 456",
      city: "Houston",
      state: "Texas",
      zipCode: "77001",
      country: "United States"
    }
  },
  securitySettings: {
    twoFactorEnabled: true,
    lastPasswordChange: "2025-08-15",
    sessionTimeout: 60
  },
  complianceSettings: {
    enabledStandards: ["ABA Model Rules", "HIPAA", "GDPR"],
    sopPreferences: ["Bluebook Citation", "Federal Rules", "State-Specific Forms"],
    documentTemplates: ["NDA Template", "Pleading Format", "Client Intake Form"]
  },
  createdAt: "2024-01-15",
  lastLogin: "2025-09-29T14:30:00"
};

const practiceAreaOptions = [
  "Family Law", "Personal Injury", "Real Estate", "Estate Planning",
  "Intellectual Property", "Business Law", "Immigration Services",
  "Bankruptcy", "Criminal Law", "Tax Law", "Employment Law"
];

const complianceOptions = [
  "ABA Model Rules", "HIPAA", "GDPR", "CCPA", "SOX", "PCI DSS"
];

const sopOptions = [
  "Bluebook Citation", "Federal Rules", "State-Specific Forms",
  "Court Filing Procedures", "Client Communication Standards"
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProfile(editedProfile);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof UserProfile] as any,
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const currentProfile = isEditing ? editedProfile : profile;

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Profile Settings</h1>
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Overview Card - Left Side */}
          <div className="w-full lg:w-80 xl:w-96 space-y-6">
            <Card>
              <CardHeader className="text-center pb-6">
                <div className="relative inline-block">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto">
                    <AvatarImage src={currentProfile.avatar} />
                    <AvatarFallback className="text-lg sm:text-xl">
                      {currentProfile.firstName[0]}{currentProfile.lastName[0]}
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
                    {currentProfile.firstName} {currentProfile.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{currentProfile.title}</p>
                  <p className="text-sm font-medium text-primary">{currentProfile.firmName}</p>
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
                    <p>{currentProfile.address.city}, {currentProfile.address.state} {currentProfile.address.zipCode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <Badge variant="default">Premium</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">2FA Status</span>
                  <Badge variant={currentProfile.securitySettings.twoFactorEnabled ? "default" : "destructive"}>
                    {currentProfile.securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Login</span>
                  <span className="text-sm font-medium">
                    {new Date(currentProfile.lastLogin).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Settings Tabs - Right Side */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
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
                  <span className="hidden sm:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="compliance" className="text-xs sm:text-sm">
                  <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Compliance</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={currentProfile.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={currentProfile.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={currentProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={currentProfile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          value={currentProfile.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firmName">Firm Name</Label>
                        <Input
                          id="firmName"
                          value={currentProfile.firmName}
                          onChange={(e) => handleInputChange('firmName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="barNumber">Bar Number (Optional)</Label>
                        <Input
                          id="barNumber"
                          value={currentProfile.barNumber || ''}
                          onChange={(e) => handleInputChange('barNumber', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">CPA License (Optional)</Label>
                        <Input
                          id="licenseNumber"
                          value={currentProfile.licenseNumber || ''}
                          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                        value={currentProfile.address.street}
                        onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={currentProfile.address.city}
                          onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={currentProfile.address.state}
                          onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={currentProfile.address.zipCode}
                          onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={currentProfile.address.country}
                          onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Practice Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {practiceAreaOptions.map(area => (
                        <div key={area} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={area}
                            checked={currentProfile.practiceAreas.includes(area)}
                            onChange={() => handleArrayToggle('practiceAreas', area)}
                            disabled={!isEditing}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={area} className="text-xs sm:text-sm">
                            {area}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
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
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={currentProfile.securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) => 
                          handleNestedInputChange('securitySettings', 'twoFactorEnabled', checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Select
                          value={currentProfile.securitySettings.sessionTimeout.toString()}
                          onValueChange={(value) => 
                            handleNestedInputChange('securitySettings', 'sessionTimeout', parseInt(value))
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="480">8 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">Password Security</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Last password change: {new Date(currentProfile.securitySettings.lastPasswordChange).toLocaleDateString()}
                        </p>
                        <Button variant="outline" size="sm">
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoiceFrequency">Invoice Frequency</Label>
                        <Select
                          value={currentProfile.billingPreferences.invoiceFrequency}
                          onValueChange={(value) => 
                            handleNestedInputChange('billingPreferences', 'invoiceFrequency', value)
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="per-project">Per Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Input
                          id="paymentMethod"
                          value={currentProfile.billingPreferences.paymentMethod}
                          onChange={(e) => handleNestedInputChange('billingPreferences', 'paymentMethod', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Compliance Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Enabled Compliance Standards</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {complianceOptions.map(standard => (
                          <div key={standard} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={standard}
                              checked={currentProfile.complianceSettings.enabledStandards.includes(standard)}
                              onChange={() => handleArrayToggle('complianceSettings.enabledStandards' as any, standard)}
                              disabled={!isEditing}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={standard} className="text-sm">
                              {standard}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">SOP Preferences</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sopOptions.map(sop => (
                          <div key={sop} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={sop}
                              checked={currentProfile.complianceSettings.sopPreferences.includes(sop)}
                              onChange={() => handleArrayToggle('complianceSettings.sopPreferences' as any, sop)}
                              disabled={!isEditing}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={sop} className="text-sm">
                              {sop}
                            </Label>
                          </div>
                        ))}
                      </div>
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
