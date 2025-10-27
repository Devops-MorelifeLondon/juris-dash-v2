// src/components/tasks/TaskDetails.tsx
import React, { useState, useMemo } from "react";
import { Task } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
import { apiClient } from "@/lib/api/config";

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

export default function TaskDetails({
  task,
  onEdit,
  onDelete,
  onUpdate,
}: TaskDetailsProps) {
  const [updatingChecklist, setUpdatingChecklist] = useState(false);

  // Priority colors
  const getPriorityColor = (priority: string) => {
    const colors = {
      Urgent: "bg-red-600 text-white",
      High: "bg-orange-500 text-white", 
      Medium: "bg-yellow-500 text-black",
      Low: "bg-green-500 text-white",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500 text-white";
  };

  // Status colors
  const getStatusColor = (status: string) => {
    const colors = {
      Completed: "bg-green-100 text-green-800 border-green-300",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
      Pending: "bg-gray-100 text-gray-800 border-gray-300",
      Cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Task type icons
  const getTaskIcon = (type: Task["type"]) => {
    const icons = {
      Research: <Briefcase className="h-4 w-4" />,
      "Document Preparation": <FileText className="h-4 w-4" />,
      "Client Communication": <User className="h-4 w-4" />,
      "Court Filing": <Calendar className="h-4 w-4" />,
      Review: <CheckCircle className="h-4 w-4" />,
      Other: <FileText className="h-4 w-4" />,
    };
    return icons[type] || <FileText className="h-4 w-4" />;
  };

  const isOverdue = useMemo(() => 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    !["Completed", "Cancelled"].includes(task.status), 
    [task]
  );

  const handleChecklistToggle = async (itemId: string, completed: boolean) => {
    setUpdatingChecklist(true);
    try {
      const response = await apiClient.patch(`/api/tasks/${task._id}/checklist/${itemId}`, {
        completed,
      });
      onUpdate(response.data.data);
      toast.success(`Checklist item ${completed ? "completed" : "updated"}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update checklist");
    } finally {
      setUpdatingChecklist(false);
    }
  };

  const checklistProgress = useMemo(() => {
    const total = task.checklistItems.length;
    const completed = task.checklistItems.filter(item => item.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [task.checklistItems]);

  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const formatUser = (user: { fullName?: string; email: string }) =>
    `${user.fullName || user.email}`;

  return (
    <Card className="h-fit border rounded-xl shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                {getTaskIcon(task.type)}
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {task.title}
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {task.type} Task • {task._id.slice(-6)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn("px-2.5 py-1 text-xs", getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className={cn("px-2.5 py-1 text-xs border", getStatusColor(task.status))}>
                {task.status}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs px-2.5 py-1">
                  <AlertCircle className="h-3 w-3 mr-1" /> Overdue
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={onEdit} 
              variant="outline" 
              size="sm" 
              className="h-9 px-3"
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              onClick={() => onDelete(task._id)} 
              variant="destructive" 
              size="sm"
              className="h-9 px-3"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        {task.description && (
          <div>
            <h3 className="font-medium mb-2 text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        <Separator />

        {/* Details Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {task.assignedBy && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">Assigned By</span>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                {formatUser(task.assignedBy)}
              </p>
            </div>
          )}

          {task.assignedTo && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">Assigned To</span>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                {formatUser(task.assignedTo)}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500">Due Date</span>
            <p className={cn(
              "text-sm flex items-center gap-2", 
              isOverdue ? "text-red-600" : "text-gray-900"
            )}>
              <Calendar className="h-4 w-4" />
              {safeFormatDate(task.dueDate)}
            </p>
          </div>

          {task.estimatedHours && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">Estimated</span>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {task.estimatedHours}h
              </p>
            </div>
          )}

          {task.actualHoursSpent > 0 && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">Actual</span>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                {task.actualHoursSpent}h
              </p>
            </div>
          )}

          {task.type && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500">Type</span>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                {getTaskIcon(task.type)}
                {task.type}
              </p>
            </div>
          )}
        </div>

        {/* Checklist */}
        {task.checklistItems.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Checklist
                </h3>
                <div className="text-sm text-gray-500">
                  {checklistProgress}% complete
                </div>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {task.checklistItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => 
                        handleChecklistToggle(item._id, checked as boolean)
                      }
                      disabled={updatingChecklist}
                      className="mt-0.5"
                    />
                    <span 
                      className={cn(
                        "text-sm flex-1 cursor-pointer",
                        item.completed && "line-through text-gray-500"
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
              <h3 className="font-medium mb-3 text-gray-900 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
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
              <h3 className="font-medium mb-2 text-gray-900">Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {task.notes}
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        <Separator />
        <div className="text-xs text-gray-500 pt-3">
          <div className="flex flex-wrap justify-between gap-2">
            <span>Created: {safeFormatDate(task.createdAt)}</span>
            <span>Last updated: {safeFormatDate(task.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
