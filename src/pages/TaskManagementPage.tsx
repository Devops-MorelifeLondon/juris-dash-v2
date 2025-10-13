// src/pages/TaskManagementPage.tsx

import React, { useEffect, useState, useCallback } from "react";
import { Layout } from "@/components/ui/layout";
import { Task, TaskFilters } from "@/components/tasks/types";
import TaskList from "@/components/tasks/TaskList";
import TaskDetails from "@/components/tasks/TaskDetails";
import TaskForm from "@/components/tasks/TaskForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ListTodo,
  CheckCircle,
  Clock,
  AlertCircle,
  Menu,
  Plus,
  Loader2
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

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

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<"details" | "edit" | "new">("details");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "",
    priority: "",
    type: "",
    caseId: "",
    search: "",
    page: 1,
    limit: 20,
  });

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.type) params.append("type", filters.type);
      if (filters.caseId) params.append("caseId", filters.caseId);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await api.get(`/api/tasks?${params.toString()}`);
      const taskData = Array.isArray(response.data?.data) ? response.data.data : [];

      setTasks(taskData);

      if (!selectedTask && taskData.length > 0 && view === "details") {
        setSelectedTask(taskData[0]);
      }
    } catch (err: any) {
      console.error("❌ Error fetching tasks:", err);
      setError(err.response?.data?.message || "Failed to fetch tasks");

      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.priority, filters.type, filters.caseId, filters.search, filters.page, filters.limit]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSave = async (taskData: any) => {
    try {
      if (view === "new") {
        const response = await api.post("/api/tasks", taskData);
        toast.success("Task created successfully");
        setTasks([response.data.data, ...tasks]);
        setSelectedTask(response.data.data);
      } else if (selectedTask) {
        const response = await api.put(`/api/tasks/${selectedTask._id}`, taskData);
        toast.success("Task updated successfully");
        setTasks((prev) =>
          prev.map((t) => (t._id === response.data.data._id ? response.data.data : t))
        );
        setSelectedTask(response.data.data);
      }
      setView("details");
      setIsMobileMenuOpen(false);
    } catch (err: any) {
      console.error("❌ Save task error:", err);
      toast.error(err.response?.data?.message || "Failed to save task");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/api/tasks/${taskId}`);
      toast.success("Task deleted successfully");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setSelectedTask(tasks.length > 1 ? tasks[0] : null);
      setView("details");
    } catch (err: any) {
      console.error("❌ Delete task error:", err);
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setView("details");
    setIsMobileMenuOpen(false);
  };

  const stats = {
    totalTasks: tasks.length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    overdue: tasks.filter(
      (t) =>
        new Date(t.dueDate) < new Date() &&
        t.status !== "Completed" &&
        t.status !== "Cancelled"
    ).length,
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchTasks}>Retry</Button>
          </div>
        </div>
      );
    }

    switch (view) {
      case "new":
      case "edit":
        return (
          <TaskForm
            taskData={view === "edit" ? selectedTask : null}
            onSave={handleSave}
            onCancel={() => setView("details")}
          />
        );
      case "details":
      default:
        return selectedTask ? (
          <TaskDetails
            task={selectedTask}
            onEdit={() => setView("edit")}
            onDelete={handleDelete}
            onUpdate={(updatedTask) => {
              setTasks((prev) =>
                prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
              );
              setSelectedTask(updatedTask);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center">
              <ListTodo className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4 text-lg">
                No tasks to display. Create your first task!
              </p>
              <Button onClick={() => setView("new")} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Task
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              {selectedTask ? selectedTask.title : "Select a task"}
            </p>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="default">
                <Menu className="h-4 w-4 mr-2" />
                All Tasks
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-96 p-0">
              <TaskList
                tasks={tasks}
                selectedTaskId={selectedTask?._id}
                onSelectTask={handleSelectTask}
                onCreateNew={() => {
                  setSelectedTask(null);
                  setView("new");
                  setIsMobileMenuOpen(false);
                }}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground mt-1">
            Organize and track all your tasks efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <TaskList
              tasks={tasks}
              selectedTaskId={selectedTask?._id}
              onSelectTask={handleSelectTask}
              onCreateNew={() => {
                setSelectedTask(null);
                setView("new");
              }}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Main Content Area */}
          <div className="min-h-[600px]">{renderMainContent()}</div>
        </div>
      </div>
    </Layout>
  );
}
