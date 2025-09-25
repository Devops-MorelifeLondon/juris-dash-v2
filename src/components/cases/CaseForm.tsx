import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Case } from "./types";

interface CaseFormProps {
  caseData?: Case | null;
  onSave: (caseData: Case) => void;
  onCancel: () => void;
}

const emptyCase: Omit<Case, 'id'> = {
  name: "",
  client: "",
  paralegal: "",
  status: "Open",
  deadline: "",
  serviceType: "",
  documents: [],
  tasks: [],
  communications: [],
};

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
    <Card>
      <CardHeader>
        <CardTitle>{caseData ? "Edit Case" : "Create New Case"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Case Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
              <Input id="client" value={formData.client} onChange={(e) => handleChange("client", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="paralegal">Paralegal</Label>
              <Input id="paralegal" value={formData.paralegal} onChange={(e) => handleChange("paralegal", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" value={formData.deadline} onChange={(e) => handleChange("deadline", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Input id="serviceType" value={formData.serviceType} onChange={(e) => handleChange("serviceType", e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Case</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
