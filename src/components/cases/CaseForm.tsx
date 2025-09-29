import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Case } from "./types";

interface CaseFormProps {
  caseData?: Case | null;
  onSave: (caseData: Case) => void;
  onCancel: () => void;
}

const emptyCase: Omit<Case, 'id' | 'createdDate' | 'lastUpdated' | 'timeSpent'> = {
  name: "",
  client: "",
  paralegal: "",
  status: "Open",
  deadline: "",
  serviceType: "",
  priority: "Medium",
  documents: [],
  tasks: [],
  communications: [],
  budget: 0,
  notes: ""
};

const serviceTypes = [
  "Family Law",
  "Personal Injury", 
  "Real Estate",
  "Estate Planning",
  "Intellectual Property",
  "Business Law",
  "Immigration Services",
  "Bankruptcy",
  "Accounting",
  "Bookkeeping",
  "Tax Preparation"
];

const paralegals = [
  "Alice Richardson",
  "Bob Kumar", 
  "Carol Martinez",
  "David Chen",
  "Emma Thompson"
];

export default function CaseForm({ caseData, onSave, onCancel }: CaseFormProps) {
  const [formData, setFormData] = useState(caseData || emptyCase);

  useEffect(() => {
    setFormData(caseData || emptyCase);
  }, [caseData]);

  const handleChange = (field: keyof Case, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Case);
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>{caseData ? "Edit Case" : "Create New Case"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Case Name *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
                placeholder="e.g., Smith vs. Smith Divorce Proceeding"
                required 
              />
            </div>

            <div>
              <Label htmlFor="client">Client Name *</Label>
              <Input 
                id="client" 
                value={formData.client} 
                onChange={(e) => handleChange("client", e.target.value)} 
                placeholder="e.g., John Smith"
                required 
              />
            </div>

            <div>
              <Label htmlFor="paralegal">Assigned Paralegal</Label>
              <Select value={formData.paralegal} onValueChange={(value) => handleChange("paralegal", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a paralegal" />
                </SelectTrigger>
                <SelectContent>
                  {paralegals.map(paralegal => (
                    <SelectItem key={paralegal} value={paralegal}>{paralegal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Case Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleChange("serviceType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                type="date" 
                value={formData.deadline} 
                onChange={(e) => handleChange("deadline", e.target.value)} 
              />
            </div>

            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <Input 
                id="budget" 
                type="number" 
                value={formData.budget || ""} 
                onChange={(e) => handleChange("budget", parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Case Notes</Label>
            <Textarea 
              id="notes" 
              value={formData.notes || ""} 
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add any relevant notes about the case..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {caseData ? "Update Case" : "Create Case"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
