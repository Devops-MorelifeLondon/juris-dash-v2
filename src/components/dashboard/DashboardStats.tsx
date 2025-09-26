import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";

// StatCard Component
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
  // A downward trend for response time is good, so we treat it as "positive"
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
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
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


// Dummy Data
const stats = [
    { title: "Active Cases", value: "124", change: "+12%", trend: "up" as const, icon: Briefcase, description: "8 new cases this week" },
    { title: "Paralegals Online", value: "18/22", change: "+2", trend: "up" as const, icon: Users, description: "4 in training sessions" },
    { title: "Avg. Response Time", value: "2.1h", change: "-18%", trend: "down" as const, icon: Clock, description: "Target: <3h response" },
    { title: "Completed Tasks", value: "89%", change: "+5%", trend: "up" as const, icon: CheckCircle2, description: "347 tasks this month" }
];

const activeCases = [
    { id: "CASE-0812", status: "Review", paralegal: { name: "R. Sharma", avatar: "/avatars/01.png" }, deadline: "2025-10-02" },
    { id: "CASE-0811", status: "Drafting", paralegal: { name: "P. Mehta", avatar: "/avatars/02.png" }, deadline: "2025-09-28" },
    { id: "CASE-0809", status: "Client Approval", paralegal: { name: "A. Verma", avatar: "/avatars/03.png" }, deadline: "2025-09-29" },
];

const draftsPendingReview = [
    { name: "Affidavit of John Doe", completion: 85, aiAssisted: true },
    { name: "Lease Agreement - Unit 4B", completion: 95, aiAssisted: true },
    { name: "Non-Disclosure Agreement", completion: 60, aiAssisted: false },
];

const recentCommunications = [
    { from: "Client: A. Kapoor", message: "Thanks for the draft, looks good. One minor change...", time: "12m ago", avatar: "/avatars/client1.png" },
    { from: "Opposing Counsel", message: "Regarding CASE-0798, we are prepared to...", time: "2h ago", avatar: "/avatars/counsel.png" },
    { from: "Paralegal: R. Sharma", message: "The research for the motion is complete.", time: "4h ago", avatar: "/avatars/01.png" },
];

const paralegalStatus = [
    { name: "Priya Mehta", avatar: "/avatars/02.png", specialization: "Corporate Law", assignment: "CASE-0811", hours: 24, online: true },
    { name: "Rohan Sharma", avatar: "/avatars/01.png", specialization: "Litigation", assignment: "CASE-0812", hours: 32, online: true },
    { name: "Anjali Verma", avatar: "/avatars/03.png", specialization: "Real Estate", assignment: "CASE-0809", hours: 18, online: false },
];

// Main Dashboard Component
export function LegalDashboard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 bg-background">
      {/* Top Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Cases */}
          <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CardHeader className="flex flex-row items-center">
              <CardTitle>Active Cases</CardTitle>
              <Button asChild size="sm" className="ml-auto gap-1">
                <a href="/cases">View All <ArrowRight className="h-4 w-4" /></a>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Paralegal</TableHead>
                    <TableHead className="text-right">Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="font-medium">{caseItem.id}</TableCell>
                      <TableCell>
                        <Badge variant={caseItem.status === 'Review' ? 'default' : 'secondary'}>{caseItem.status}</Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={caseItem.paralegal.avatar} />
                            <AvatarFallback>{caseItem.paralegal.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {caseItem.paralegal.name}
                      </TableCell>
                      <TableCell className="text-right">{new Date(caseItem.deadline).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
             {/* Drafts Pending Review */}
            <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle>Drafts Pending Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {draftsPendingReview.map((draft) => (
                  <div key={draft.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" /> {draft.name}
                      </span>
                      {draft.aiAssisted && <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-500 bg-blue-500/10">AI Assisted</Badge>}
                    </div>
                    <Progress value={draft.completion} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{draft.completion}% Complete</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Communications */}
            <Card className="animate-fade-in" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle>Recent Communications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCommunications.map((comm) => (
                  <div key={comm.from + comm.time} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comm.avatar} />
                      <AvatarFallback>{comm.from.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full overflow-hidden">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{comm.from}</p>
                        <p className="text-xs text-muted-foreground">{comm.time}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{comm.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Deadlines This Week */}
          <Card className="animate-fade-in" style={{ animationDelay: "700ms" }}>
            <CardHeader>
                <CardTitle>Deadlines This Week</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border p-0"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                }}
              />
            </CardContent>
          </Card>
          
          {/* Paralegal Status */}
          <Card className="animate-fade-in" style={{ animationDelay: "800ms" }}>
            <CardHeader>
              <CardTitle>Paralegal Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paralegalStatus.map((paralegal) => (
                <div key={paralegal.name} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 relative">
                    <AvatarImage src={paralegal.avatar} />
                    <AvatarFallback>{paralegal.name.charAt(0)}</AvatarFallback>
                    {paralegal.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{paralegal.name}</p>
                    <p className="text-xs text-muted-foreground">{paralegal.specialization} | {paralegal.assignment}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{paralegal.hours}h</p>
                    <p className="text-xs text-muted-foreground">Tracked</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
