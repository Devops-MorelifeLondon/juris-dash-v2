// src/components/tasks/TaskList.tsx
import React, { useMemo } from "react";
import { Task, TaskFilters } from "./types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Calendar, User, AlertCircle, FileText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  selectedTaskId?: string;
  onSelectTask: (task: Task) => void;
  onCreateNew: () => void;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export default function TaskList({
  tasks,
  selectedTaskId,
  onSelectTask,
  onCreateNew,
  filters,
  onFiltersChange,
}: TaskListProps) {
  // Priority colors - simplified
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Urgent: "bg-red-600 text-white",
      High: "bg-orange-500 text-white",
      Medium: "bg-yellow-500 text-white",
      Low: "bg-green-500 text-white",
      default: "bg-gray-500 text-white",
    };
    return colors[priority as keyof typeof colors] || colors.default;
  };

  // Status colors - simplified
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Completed: "bg-green-100 text-green-800 border-green-200",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
      Pending: "bg-gray-100 text-gray-800 border-gray-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status as keyof typeof colors] || colors.default;
  };

  // Task type icons
  const getTaskIcon = (type: Task["type"]) => {
    const icons: Record<Task["type"], React.ReactNode> = {
      Research: <FileText className="h-3 w-3" />,
      "Document Preparation": <FileText className="h-3 w-3" />,
      "Client Communication": <User className="h-3 w-3" />,
      "Court Filing": <Calendar className="h-3 w-3" />,
      Review: <Clock className="h-3 w-3" />,
      Other: <FileText className="h-3 w-3" />,
    };
    return icons[type] || <FileText className="h-3 w-3" />;
  };

  // Overdue check
  const isOverdue = (dueDate: string, status: string) => {
    return (
      dueDate &&
      new Date(dueDate) < new Date() &&
      status !== "Completed" &&
      status !== "Cancelled"
    );
  };

  // Filtered and sorted tasks
  const processedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.type) {
      filtered = filtered.filter(task => task.type === filters.type);
    }

    // Sort by priority first (Urgent > High > Medium > Low), then by due date
    const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
    filtered.sort((a, b) => {
      const priorityDiff = (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
                           (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
      if (priorityDiff !== 0) return priorityDiff;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return filtered;
  }, [tasks, filters]);

  // Format user name
  const formatUser = (user: { fullName?: string; email: string }) => {
    return user.fullName || user.email.split('@')[0];
  };

  // Active filters count
  const activeFilters = useMemo(() => {
    const count = (filters.search ? 1 : 0) +
                 (filters.status ? 1 : 0) +
                 (filters.priority ? 1 : 0) +
                 (filters.type ? 1 : 0);
    return count;
  }, [filters]);

  return (
    <Card className="h-fit flex flex-col border rounded-xl shadow-sm">
      <CardHeader className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Tasks ({processedTasks.length})
            </CardTitle>
            {activeFilters > 0 && (
              <p className="text-xs text-gray-500">
                {activeFilters} active filter{activeFilters > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <Button 
            onClick={onCreateNew} 
            size="sm" 
            className="h-9 px-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value, page: 1 })
            }
            className="h-10 pl-10 pr-4 bg-gray-50 border-gray-200 focus:border-blue-500"
          />
        </div>

        {/* Filters - Clean Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              onFiltersChange({ 
                ...filters, 
                status: value === 'all' ? '' : value as Task["status"], 
                page: 1 
              })
            }
          >
            <SelectTrigger className="h-10 bg-gray-50 border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority || "all"}
            onValueChange={(value) =>
              onFiltersChange({ 
                ...filters, 
                priority: value === 'all' ? '' : value as Task["priority"], 
                page: 1 
              })
            }
          >
            <SelectTrigger className="h-10 bg-gray-50 border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              onFiltersChange({ 
                ...filters, 
                type: value === 'all' ? '' : value as Task["type"], 
                page: 1 
              })
            }
          >
            <SelectTrigger className="h-10 bg-gray-50 border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
              <SelectItem value="Document Preparation">Document Preparation</SelectItem>
              <SelectItem value="Client Communication">Client Communication</SelectItem>
              <SelectItem value="Court Filing">Court Filing</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4 py-4">
          <div className="space-y-3 min-h-full">
            {processedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-8 w-8 text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No tasks found</h3>
                <p className="text-xs text-gray-500">
                  {filters.search || activeFilters > 0 
                    ? "Try adjusting your filters" 
                    : "Get started by creating your first task"
                  }
                </p>
              </div>
            ) : (
              processedTasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <div
                    key={task._id}
                    onClick={() => onSelectTask(task)}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-md",
                      selectedTaskId === task._id
                        ? "border-blue-300 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-200 bg-white",
                      overdue && "border-red-200 hover:border-red-300"
                    )}
                  >
                    <div className="space-y-2">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        {/* Task Type & Title */}
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div className={cn(
                            "p-1.5 rounded-md flex-shrink-0",
                            task.type === "Research" && "bg-blue-100",
                            task.type === "Document Preparation" && "bg-green-100",
                            task.type === "Client Communication" && "bg-purple-100",
                            task.type === "Court Filing" && "bg-red-100",
                            task.type === "Review" && "bg-yellow-100",
                            task.type === "Other" && "bg-gray-100"
                          )}>
                            {getTaskIcon(task.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {task.description || task.type}
                            </p>
                          </div>
                        </div>

                        {/* Priority Badge */}
                        <Badge 
                          className={cn(
                            "text-xs px-2 py-1 whitespace-nowrap flex-shrink-0",
                            getPriorityColor(task.priority)
                          )}
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Status & Metadata Row */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        {/* Status */}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs px-2 py-0.5 flex-shrink-0",
                            getStatusColor(task.status)
                          )}
                        >
                          {task.status}
                        </Badge>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 flex-1 justify-end text-xs text-gray-500">
                          {/* Due Date */}
                          <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {task.dueDate 
                                ? formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })
                                : "No due date"
                              }
                            </span>
                            {overdue && (
                              <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0 ml-1" />
                            )}
                          </div>

                          {/* Assignee */}
                          {task.assignedTo && (
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <User className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate max-w-[80px]">
                                {formatUser(task.assignedTo)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Checklist Progress - if exists */}
                      {task.checklistItems && task.checklistItems.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.round(
                                  (task.checklistItems.filter(item => item.completed).length / task.checklistItems.length) * 100
                                )}%` 
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {task.checklistItems.filter(item => item.completed).length}/
                            {task.checklistItems.length}
                          </span>
                        </div>
                      )}

                      {/* Tags - simplified */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {task.tags.slice(0, 2).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs px-2 py-0.5 bg-gray-100"
                            >
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
