// @/components/cases/CaseDetails.tsx

import React from "react";
import { Case, Attorney, Paralegal } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Calendar,
  User,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Clock,
  Briefcase,
  BookUser,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseDetailsProps {
  caseData: Case;
  onEdit: () => void;
  onUpdateCase: (updatedCase: Case) => void;
}

// Helper component for consistent detail items
const DetailItem = ({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}) => {
  // Render nothing if value is null, undefined, or an empty string
  if (!value) return null;
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      {/* FIX: Added break-words to prevent horizontal overflow */}
      <span className="text-sm text-foreground break-words">{value}</span>
    </div>
  );
};

const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, onEdit }) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not set";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getAttorneyName = () => {
    if (!caseData.attorney) return "Not assigned";
    if (typeof caseData.attorney === "string") return caseData.attorney;
    return (caseData.attorney as Attorney).fullName;
  };

  const getAttorneyEmail = () => {
    if (!caseData.attorney || typeof caseData.attorney === "string") return null;
    return (caseData.attorney as Attorney).email;
  };

  const getParalegalName = () => {
    if (!caseData.paralegal) return "Not assigned";
    if (typeof caseData.paralegal === "string") return caseData.paralegal;
    return (caseData.paralegal as Paralegal).fullName;
  };

  return (
    // COMPACT: Reduced padding and spacing
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground font-mono">
            Case #{caseData.caseNumber}
          </div>
          {/* COMPACT: Reduced font size */}
          <h1 className="text-xl font-bold mt-1">{caseData.name}</h1>
          {/* COMPACT: Reduced margin-top */}
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{caseData.status}</Badge>
            <Badge variant="outline">{caseData.priority} Priority</Badge>
          </div>
        </div>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Edit Case
        </Button>
      </div>

      <Separator />

      {/* COMPACT: Reduced gap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (Main Details) */}
        {/* COMPACT: Reduced space-y */}
        <div className="lg:col-span-2 space-y-4">
          {/* Case Details */}
          <Card>
            {/* COMPACT: Reduced padding */}
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Case Details
              </CardTitle>
            </CardHeader>
            {/* COMPACT: Reduced padding and gap */}
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <DetailItem label="Service Type" value={caseData.serviceType} />
              {caseData.serviceType === "Other" && (
                <DetailItem
                  label="Service Description"
                  value={caseData.otherServiceTypeDescription}
                />
              )}
              <DetailItem
                label="Deadline"
                value={formatDate(caseData.deadline)}
                icon={Calendar}
              />
              <DetailItem
                label="Created"
                value={formatDate(caseData.createdAt)}
              />
              <DetailItem
                label="Last Updated"
                value={formatDate(caseData.updatedAt)}
              />
            </CardContent>
          </Card>

          {/* Financial */}
          <Card>
            {/* COMPACT: Reduced padding */}
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial
              </CardTitle>
            </CardHeader>
            {/* COMPACT: Reduced padding and gap */}
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <DetailItem
                label="Budget"
                value={formatCurrency(caseData.budget)}
              />
              <DetailItem
                label="Hourly Rate"
                value={`${formatCurrency(caseData.agreedHourlyRate)}/hr`}
              />
              <DetailItem
                label="Hours Spent"
                value={`${caseData.actualHoursSpent || 0} hrs`}
                icon={Clock}
              />
              <DetailItem
                label="Total Cost"
                value={formatCurrency(caseData.totalCost)}
                className="font-semibold text-green-600"
              />
            </CardContent>
          </Card>

          {/* Notes */}
          {caseData.notes && (
            <Card>
              {/* COMPACT: Reduced padding */}
              <CardHeader className="p-4">
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              {/* COMPACT: Reduced padding */}
              <CardContent className="p-4">
                {/* FIX: Added break-words to prevent overflow */}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                  {caseData.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (People) */}
        {/* COMPACT: Reduced space-y */}
        <div className="space-y-4">
          {/* Client Information */}
          <Card>
            {/* COMPACT: Reduced padding */}
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Client
              </CardTitle>
            </CardHeader>
            {/* COMPACT: Reduced padding and space-y */}
            <CardContent className="p-4 space-y-3">
              <DetailItem label="Name" value={caseData.client?.name || "N/A"} />
              <DetailItem
                label="Email"
                value={caseData.client?.email}
                icon={Mail}
              />
              <DetailItem
                label="Phone"
                value={caseData.client?.phone}
                icon={Phone}
              />
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            {/* COMPACT: Reduced padding */}
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Team
              </CardTitle>
            </CardHeader>
            {/* COMPACT: Reduced padding and space-y */}
            <CardContent className="p-4 space-y-3">
              <DetailItem
                label="Attorney"
                value={getAttorneyName()}
                icon={BookUser}
              />
              {getAttorneyEmail() && (
                <DetailItem
                  label="Attorney Email"
                  value={getAttorneyEmail()}
                  icon={Mail}
                />
              )}
              <DetailItem
                label="Paralegal"
                value={getParalegalName()}
                icon={BookUser}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;