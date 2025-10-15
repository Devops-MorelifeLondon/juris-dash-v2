// src/components/dashboard/TaskStats.tsx
import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  ListTodo, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  PlayCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTaskStats } from "@/hooks/useTaskStats";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
  description?: string;
  className?: string;
  variant?: "default" | "warning" | "success" | "info";
}

function TaskStatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  description, 
  className,
  variant = "default" 
}: StatCardProps) {
  const isPositive = trend === "up";

  const variantColors = {
    default: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-elegant hover:scale-[1.02] group",
      "bg-gradient-card border-border/50",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
          "group-hover:scale-110 group-hover:shadow-glow",
          variantColors[variant]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-foreground animate-scale-in">
            {value}
          </div>
          {change && trend && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs animate-fade-in",
                isPositive
                  ? "border-success/20 text-success bg-success/5"
                  : "border-destructive/20 text-destructive bg-destructive/5"
              )}
            >
              {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {change}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 animate-fade-in">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function TaskStats() {
  const { stats, loading, error } = useTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Error loading task statistics: {error}</p>
      </div>
    );
  }

  // Calculate metrics from stats
  const totalTasks = stats?.byStatus.reduce((acc, s) => acc + s.count, 0) || 0;
  const completedTasks = stats?.byStatus.find((s) => s._id === "Completed")?.count || 0;
  const inProgressTasks = stats?.byStatus.find((s) => s._id === "In Progress")?.count || 0;
  const notStartedTasks = stats?.byStatus.find((s) => s._id === "Not Started")?.count || 0;
  const blockedTasks = stats?.byStatus.find((s) => s._id === "Blocked")?.count || 0;
  const overdueTasks = stats?.overdue || 0;
  
  const totalHours = stats?.byStatus.reduce((acc, s) => acc + s.totalHours, 0) || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const taskStatsData = [
    { 
      title: "Total Tasks", 
      value: String(totalTasks), 
      change: "+8%", 
      trend: "up" as const, 
      icon: ListTodo, 
      description: `${completedTasks} completed`,
      variant: "default" as const
    },
    { 
      title: "In Progress", 
      value: String(inProgressTasks), 
      icon: PlayCircle, 
      description: `${notStartedTasks} not started`,
      variant: "info" as const
    },
    { 
      title: "Overdue Tasks", 
      value: String(overdueTasks), 
      icon: AlertCircle, 
      description: overdueTasks > 0 ? "Needs attention" : "All on track",
      variant: overdueTasks > 0 ? "warning" as const : "success" as const
    },
    { 
      title: "Completion Rate", 
      value: `${completionRate}%`, 
      change: "+5%", 
      trend: "up" as const, 
      icon: CheckCircle2, 
      description: `${completedTasks}/${totalTasks} tasks`,
      variant: "success" as const
    },
    { 
      title: "Total Hours", 
      value: `${totalHours.toFixed(1)}h`, 
      change: "+12%", 
      trend: "up" as const, 
      icon: Clock, 
      description: "Tracked across tasks",
      variant: "default" as const
    },
    { 
      title: "Blocked Tasks", 
      value: String(blockedTasks), 
      icon: XCircle, 
      description: blockedTasks > 0 ? "Requires resolution" : "No blockers",
      variant: blockedTasks > 0 ? "warning" as const : "success" as const
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Overview</h2>
          <p className="text-muted-foreground">Track task progress and productivity</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {taskStatsData.map((stat, index) => (
          <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <TaskStatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Task Status Breakdown */}
      {stats && stats.byStatus.length > 0 && (
        <Card className="bg-gradient-card shadow-card mt-6">
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.byStatus.map((statusItem) => {
                const percentage = totalTasks > 0 ? (statusItem.count / totalTasks) * 100 : 0;
                const statusColors: Record<string, string> = {
                  "Completed": "bg-success",
                  "In Progress": "bg-info",
                  "Not Started": "bg-muted",
                  "Blocked": "bg-destructive",
                  "Cancelled": "bg-muted-foreground"
                };

                return (
                  <div key={statusItem._id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", statusColors[statusItem._id] || "bg-muted")} />
                        <span className="font-medium">{statusItem._id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{statusItem.count} tasks</span>
                        <span className="font-medium">{statusItem.totalHours.toFixed(1)}h</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={cn("h-full transition-all duration-500", statusColors[statusItem._id] || "bg-muted")}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
