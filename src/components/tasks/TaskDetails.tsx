// src/components/tasks/TaskDetails.tsx

import React, { useState } from "react";
import { Task } from "./types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskDetailsProps {
  task: Task;
  onEdit: () => void;
  onDelete: (taskId: string) => void;
  onUpdate: (updatedTask: Task) => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function TaskDetails({ task, onEdit, onDelete, onUpdate }: TaskDetailsProps) {
  const [updatingChecklist, setUpdatingChecklist] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-black";
      case "Low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Blocked":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Not Started":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed" &&
    task.status !== "Cancelled";

  const handleChecklistToggle = async (itemId: string, completed: boolean) => {
    setUpdatingChecklist(true);
    try {
      const response = await api.patch(`/api/tasks/${task._id}/checklist/${itemId}`, {
        completed,
      });
      onUpdate(response.data.data);
      toast.success("Checklist item updated");
    } catch (err: any) {
      console.error("❌ Update checklist error:", err);
      toast.error(err.response?.data?.message || "Failed to update checklist");
    } finally {
      setUpdatingChecklist(false);
    }
  };

  const completedChecklist = task.checklistItems.filter((item) => item.completed).length;
  const totalChecklist = task.checklistItems.length;
  const checklistProgress =
    totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  // Helper to get assigned to display name
  const getAssignedToName = () => {
    if (task.demoAssignedTo) return task.demoAssignedTo;
    if (task.assignedTo?.fullName) return task.assignedTo.fullName;
    return "Unassigned";
  };

  const hasAssignedTo = task.demoAssignedTo || task.assignedTo;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-2xl">{task.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                {task.priority} Priority
              </Badge>
              <Badge variant="outline" className={cn("text-xs", getStatusColor(task.status))}>
                {task.status}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button onClick={() => onDelete(task._id)} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
        </div>

        <Separator />

        {/* Task Details Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Type</p>
            <p className="text-sm flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {task.type}
            </p>
          </div>

          {/* Due Date */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Due Date</p>
            <p className={cn("text-sm flex items-center gap-2", isOverdue && "text-red-600")}>
              <Calendar className="h-4 w-4" />
              {format(new Date(task.dueDate), "PPP")}
            </p>
          </div>

          {/* Assigned By */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Assigned By</p>
            <p className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              {task.assignedBy.fullName}
            </p>
          </div>

          {/* Assigned To */}
          {hasAssignedTo && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Assigned To</p>
              <p className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                {getAssignedToName()}
              </p>
            </div>
          )}

          {/* Estimated Hours */}
          {task.estimatedHours && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Hours</p>
              <p className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {task.estimatedHours}h
              </p>
            </div>
          )}

          {/* Actual Hours */}
          {/* {task.actualHoursSpent && task.actualHoursSpent > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Actual Hours Spent</p>
              <p className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {task.actualHoursSpent}h
              </p>
            </div>
          )} */}

          {/* Start Date */}
          {task.startDate && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Started On</p>
              <p className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(task.startDate), "PPP")}
              </p>
            </div>
          )}

          {/* Completed Date */}
          {task.completedDate && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed On</p>
              <p className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {format(new Date(task.completedDate), "PPP")}
              </p>
            </div>
          )}
        </div>

        {/* Case */}
        {task.case && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Related Case</h3>
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="font-medium">{task.case.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Case #: {task.case.caseNumber}
                  </p>
                  {task.case.serviceType && (
                    <p className="text-sm text-muted-foreground">Type: {task.case.serviceType}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Checklist */}
        {task.checklistItems.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Checklist
                </h3>
                <span className="text-sm text-muted-foreground">
                  {completedChecklist}/{totalChecklist} ({checklistProgress}%)
                </span>
              </div>
              <div className="space-y-2">
                {task.checklistItems.map((item) => (
                  <div key={item._id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) =>
                        handleChecklistToggle(item._id, checked as boolean)
                      }
                      disabled={updatingChecklist}
                    />
                    <span
                      className={cn(
                        "text-sm flex-1",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Notes */}
        {task.notes && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.notes}</p>
            </div>
          </>
        )}

        {/* Metadata */}
        <Separator />
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Created: {format(new Date(task.createdAt), "PPP 'at' p")}</p>
          <p>Last Updated: {format(new Date(task.updatedAt), "PPP 'at' p")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
