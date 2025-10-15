// src/components/dashboard/DashboardStats.tsx (Updated LegalDashboard)
import React from "react";
import { TrendingUp, TrendingDown, Users, Briefcase, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCaseStats } from "@/hooks/useCaseStats";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  description?: string;
  className?: string;
}

function StatCard({ title, value, change, trend, icon: Icon, description, className }: StatCardProps) {
  const isPositive = title === "Avg. Response Time" ? trend === "down" : trend === "up";

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
          isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-foreground animate-scale-in">
            {value}
          </div>
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

export function LegalDashboard() {
  const { stats, loading, error } = useCaseStats();

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
        <p>Error loading statistics: {error}</p>
      </div>
    );
  }

  const activeCasesCount = stats?.byStatus.find((s) => s._id === "In Progress")?.count || 0;
  const completedPercentage = stats ? Math.round((stats.byStatus.find((s) => s._id === "Completed")?.count || 0) / stats.totalCases * 100) : 0;
  const totalHours = stats?.byStatus.reduce((acc, s) => acc + s.totalHours, 0) || 0;

  const dashboardStats = [
    { 
      title: "Active Cases", 
      value: String(stats?.totalCases || 0), 
      change: "+12%", 
      trend: "up" as const, 
      icon: Briefcase, 
      description: `${activeCasesCount} in progress` 
    },
    { 
      title: "Total Hours Tracked", 
      value: `${totalHours.toFixed(1)}h`, 
      change: "+18%", 
      trend: "up" as const, 
      icon: Clock, 
      description: "Across all cases" 
    },
    { 
      title: "Completion Rate", 
      value: `${completedPercentage}%`, 
      change: "+5%", 
      trend: "up" as const, 
      icon: CheckCircle2, 
      description: "This month" 
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dashboardStats.map((stat, index) => (
        <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
}
