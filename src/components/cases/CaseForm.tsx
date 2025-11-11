// @/components/cases/CaseForm.tsx

import React, { useState, useEffect } from "react";
import { Case } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api/config";

interface CaseFormProps {
  caseData: Case | null;
  onSave: (caseData: Case) => void;
  onCancel: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ caseData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Case>>({
    caseNumber: "",
    name: "",
    client: { name: "", email: "", phone: "" },
    serviceType: "Immigration Services",
    otherServiceTypeDescription: "",
    status: "New",
    priority: "Medium",
    deadline: "",
    budget: 0,
    agreedHourlyRate: 0,
    actualHoursSpent: 0,
    totalCost: 0,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (caseData) {
      setFormData({
        ...caseData,
        deadline: caseData.deadline
          ? new Date(caseData.deadline).toISOString().split("T")[0]
          : "",
        otherServiceTypeDescription: caseData.otherServiceTypeDescription || "",
        client: caseData.client || { name: "", email: "", phone: "" },
      });
    }
  }, [caseData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      client: {
        ...(prev.client || {}),
        [name]: value,
      },
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget) || 0,
        agreedHourlyRate: Number(formData.agreedHourlyRate) || 0,
        actualHoursSpent: Number(formData.actualHoursSpent) || 0,
        totalCost: Number(formData.totalCost) || 0,
        deadline: formData.deadline || null, // Handle empty date
      };

      if (caseData?._id) {
        // Update
        const response = await apiClient.put(
          `/api/cases/${caseData._id}`,
          payload
        );
        onSave(response.data.data);
      } else {
        // Create
        const response = await apiClient.post(
          `/api/cases`,
          payload
        );
        onSave(response.data.data);
      }
    } catch (err: any) {
      console.error("Error saving case:", err);
      setError(err.response?.data?.message || "Failed to save case");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {caseData ? "Edit Case" : "New Case"}
        </h2>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="caseNumber">Case Number *</Label>
              <Input
                id="caseNumber"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Case Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  handleSelectChange("serviceType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Family Law">Family Law</SelectItem>
                  <SelectItem value="Personal Injury">Personal Injury</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Immigration Services">
                    Immigration Services
                  </SelectItem>
                  {/* ... other items ... */}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {formData.serviceType === "Other" && (
            <div>
              <Label htmlFor="otherServiceTypeDescription">
                Specify Other Service Type *
              </Label>
              <Input
                id="otherServiceTypeDescription"
                name="otherServiceTypeDescription"
                value={formData.otherServiceTypeDescription || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="client-name">Client Name *</Label>
            <Input
              id="client-name"
              name="name"
              value={formData.client?.name || ""}
              onChange={handleClientChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                name="email"
                type="email"
                value={formData.client?.email || ""}
                onChange={handleClientChange}
              />
            </div>
            <div>
              <Label htmlFor="client-phone">Phone</Label>
              <Input
                id="client-phone"
                name="phone"
                value={formData.client?.phone || ""}
                onChange={handleClientChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="0.01"
              value={formData.budget}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="agreedHourlyRate">Hourly Rate ($)</Label>
            <Input
              id="agreedHourlyRate"
              name="agreedHourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.agreedHourlyRate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="actualHoursSpent">Hours Spent</Label>
            <Input
              id="actualHoursSpent"
              name="actualHoursSpent"
              type="number"
              min="0"
              step="0.5"
              value={formData.actualHoursSpent}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="totalCost">Total Cost ($)</Label>
            <Input
              id="totalCost"
              name="totalCost"
              type="number"
              min="0"
              step="0.01"
              value={formData.totalCost}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleInputChange}
            placeholder="Add any additional notes..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 sticky bottom-0 py-4 bg-background">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {caseData ? "Update Case" : "Create Case"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CaseForm;