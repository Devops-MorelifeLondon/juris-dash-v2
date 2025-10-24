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
  FileText,
} from "lucide-react";

interface CaseDetailsProps {
  caseData: Case;
  onEdit: () => void;
  onUpdateCase: (updatedCase: Case) => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({
  caseData,
  onEdit,
}) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not set";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "$0.00";
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground font-mono">
            Case #{caseData.caseNumber}
          </div>
          <h1 className="text-3xl font-bold mt-1">{caseData.name}</h1>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {caseData.status}
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              {caseData.priority}
            </Badge>
          </div>
        </div>
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Case
        </Button>
      </div>

      <Separator />

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Name</div>
            <div className="text-base">{caseData.client?.name || "N/A"}</div>
          </div>
          {caseData.client?.email && (
            <div>
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email
              </div>
              <div className="text-base">{caseData.client.email}</div>
            </div>
          )}
          {caseData.client?.phone && (
            <div>
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Phone
              </div>
              <div className="text-base">{caseData.client.phone}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Case Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Case Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Service Type</div>
            <div className="text-base">{caseData.serviceType}</div>
          </div>
          {caseData.serviceType == 'Other' && 
           <div>
            <div className="text-sm font-medium text-muted-foreground">Description of Service</div>
            <div className="text-base">{caseData.otherServiceTypeDescription}</div>
          </div>
          }
          <div>
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Deadline
            </div>
            <div className="text-base">{formatDate(caseData.deadline)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Created</div>
            <div className="text-base">{formatDate(caseData.createdAt)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
            <div className="text-base">{formatDate(caseData.updatedAt)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Attorney</div>
            <div className="text-base">{getAttorneyName()}</div>
            {getAttorneyEmail() && (
              <div className="text-sm text-muted-foreground">{getAttorneyEmail()}</div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Paralegal</div>
            <div className="text-base">{getParalegalName()}</div>
          </div>
        </CardContent>
      </Card>

      {/* Financial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Budget</div>
            <div className="text-base font-semibold">{formatCurrency(caseData.budget)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Hourly Rate</div>
            <div className="text-base">{formatCurrency(caseData.agreedHourlyRate)}/hr</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Hours Spent
            </div>
            <div className="text-base">{caseData.actualHoursSpent || 0} hrs</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total Cost</div>
            <div className="text-base font-semibold text-green-600">
              {formatCurrency(caseData.totalCost)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {caseData.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {caseData.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CaseDetails;
