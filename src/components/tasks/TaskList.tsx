// src/components/tasks/TaskList.tsx

import React from "react";
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
import { Plus, Search, Calendar, User, AlertCircle } from "lucide-react";
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

  console.log(tasks);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500 text-white border-red-500";
      case "High":
        return "bg-orange-500 text-white border-orange-500";
      case "Medium":
        return "bg-yellow-400 text-black border-yellow-500";
      case "Low":
        return "bg-green-500 text-white border-green-500";
      default:
        return "bg-gray-500 text-white border-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return (
      new Date(dueDate) < new Date() &&
      status !== "Completed" &&
      status !== "Cancelled"
    );
  };

  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">All Tasks</CardTitle>
          <Button onClick={onCreateNew} size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value, page: 1 })
            }
            className="pl-10 pr-4 h-10 w-full"
          />
        </div>

        {/* Filters - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value === 'all' ? '' : value, page: 1 })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, priority: value === 'all' ? '' : value, page: 1 })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, type: value === 'all' ? '' : value, page: 1 })
            }
          >
            <SelectTrigger className="h-10">
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
        <ScrollArea className="h-full px-4 sm:px-6 py-4">
          <div className="space-y-3 min-h-full">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2 text-gray-400" />
                <p className="text-sm font-medium">No tasks found</p>
                <p className="text-xs mt-1">Try adjusting your filters or create a new task</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => onSelectTask(task)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg active:shadow-md",
                    selectedTaskId === task._id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-border/50"
                  )}
                >
                  <div className="space-y-3">
                    {/* Title and Priority - Responsive Flex */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">
                        {task.title}
                      </h3>
                      <Badge 
                        className={cn("text-xs px-2 py-1 whitespace-nowrap self-start sm:self-end", getPriorityColor(task.priority))}
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    {/* Status */}
                    <Badge
                      variant="outline"
                      className={cn("text-xs w-fit", getStatusColor(task.status))}
                    >
                      {task.status}
                    </Badge>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                      {/* Due Date */}
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                        </span>
                        {isOverdue(task.dueDate, task.status) && (
                          <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0 ml-1" />
                        )}
                      </div>

                      {/* Assigned To */}
                      {task.assignedTo && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[120px]">{task.assignedTo.firstName}</span>
                        </div>
                      )}
                    </div>

                    {/* Case */}
                    {task.case && (
                      <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                        Case: <span className="font-medium">{task.case.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
