// src/components/tasks/TaskForm.tsx

import React, { useState, useEffect } from "react";
import { Task, TaskFormData } from "./types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, Save, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Cookies from "js-cookie";
import { cn } from "@/lib/utils"; // For combining class names
import { apiClient } from "@/lib/api/config";



// Types
type Availability = 'Available Now' | 'Available Soon' | 'Fully Booked' | 'Not Available';

interface TaskFormProps {
  taskData: Task | null;
  onSave: (data: TaskFormData) => void;
  onCancel: () => void;
}

interface Case {
  _id: string;
  name: string;
  caseNumber: string;
  status: string;
}

interface Paralegal {
  _id: string;
  fullName: string;
  available: Availability;
}

// Badge Component for Availability
const AvailabilityBadge = ({ status }: { status: Availability }) => {
  const badgeStyles = {
    'Available Now': "bg-green-100 text-green-800 border-green-200",
    'Available Soon': "bg-yellow-100 text-yellow-800 border-yellow-200",
    'Fully Booked': "bg-red-100 text-red-800 border-red-200",
    'Not Available': "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={cn(
        "ml-2 px-2 py-0.5 text-xs font-medium rounded-full border",
        badgeStyles[status] || "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </span>
  );
};

export default function TaskForm({ taskData, onSave, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    type: "Research",
    priority: "Medium",
    dueDate: "",
    estimatedHours: undefined,
    checklistItems: [],
    notes: "",
    tags: [],
  });

  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cases, setCases] = useState<Case[]>([]);
  const [paralegals, setParalegals] = useState<Paralegal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const casesParams = new URLSearchParams({ page: "1", limit: "100" });
        const [casesResponse, paralegalsResponse] = await Promise.all([
          apiClient.get(`/api/cases/my-cases?${casesParams.toString()}`),
          apiClient.get(`/api/paralegals`),
        ]);

        if (casesResponse.data.success) {
          setCases(casesResponse.data.data.filter(
            (c: Case) => !["Completed", "Cancelled", "Declined"].includes(c.status)
          ));
        } else {
          toast.error("Failed to fetch cases");
        }

        if (paralegalsResponse.data.success) {
          setParalegals(paralegalsResponse.data.data.map((p: any) => ({
            _id: p._id,
            fullName: `${p.firstName} ${p.lastName}`,
            available: p.availability,
          })));
        } else {
          toast.error("Failed to fetch paralegals");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to fetch necessary data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (taskData) {
      setFormData({
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        priority: taskData.priority,
        dueDate: taskData.dueDate.split("T")[0],
        estimatedHours: taskData.estimatedHours,
        checklistItems: taskData.checklistItems,
        notes: taskData.notes || "",
        tags: taskData.tags,
      });
    }
  }, [taskData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSave({ ...formData, case: formData.case || null, assignedTo: formData.assignedTo || null, domain: 'Family Law' });
  };
  
    const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData({
        ...formData,
        checklistItems: [
          ...formData.checklistItems,
          { text: newChecklistItem.trim(), completed: false },
        ],
      });
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index: number) => {
    setFormData({
      ...formData,
      checklistItems: formData.checklistItems.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading form...</p>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{taskData ? "Edit Task" : "Create New Task"}</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <CardContent className="space-y-4 pt-4">
            {/* Form fields */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter task title" className={errors.title ? "border-red-500" : ""} aria-required="true" />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter task description" rows={4} className={errors.description ? "border-red-500" : ""} aria-required="true" />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

     
            
          

            <div className="grid md:grid-cols-2 gap-4">
                {/* Type and Priority Selects */}
                 <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type" aria-required="true">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Drafting">Document Preparation</SelectItem>
                    <SelectItem value="Communication">Client Communication</SelectItem>
                    <SelectItem value="Filing">Court Filing</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Due Date and Estimated Hours */}
                <div className="space-y-2">
                <Label htmlFor="dueDate">
                  Due Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={errors.dueDate ? "border-red-500" : ""}
                  aria-required="true"
                />
                {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedHours: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g., 8"
                />
              </div>
            </div>
            
            {/* Checklist */}
             <div className="space-y-2">
              <Label>Checklist Items</Label>
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add checklist item"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addChecklistItem())}
                />
                <Button type="button" onClick={addChecklistItem} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.checklistItems.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Checkbox checked={item.completed} disabled />
                      <span className="flex-1 text-sm">{item.text}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChecklistItem(index)}
                        aria-label={`Remove item: ${item.text}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded text-sm"
                    >
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(index)} aria-label={`Remove tag: ${tag}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes..." rows={3} />
            </div>

          </CardContent>
        </ScrollArea>
        <CardFooter className="flex gap-2 justify-end border-t pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}><XCircle className="h-4 w-4 mr-2" />Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}{taskData ? "Update Task" : "Create Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

