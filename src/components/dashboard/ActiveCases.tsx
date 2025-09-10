import { useState } from "react";
import { 
  MoreHorizontal, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  FileText,
  MessageCircle,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CaseCardProps {
  case: {
    id: string;
    name: string;
    client: string;
    paralegal: {
      name: string;
      avatar?: string;
      status: "online" | "offline" | "busy";
    };
    status: "active" | "pending" | "review" | "completed";
    priority: "high" | "medium" | "low";
    deadline: string;
    progress: number;
    lastActivity: string;
    tasksCount: number;
    messagesCount: number;
  };
}

function CaseCard({ case: caseData }: CaseCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-info text-info-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      case "review": return "bg-primary text-primary-foreground";
      case "completed": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive border-destructive/20";
      case "medium": return "text-warning border-warning/20";
      case "low": return "text-success border-success/20";
      default: return "text-muted-foreground border-border";
    }
  };

  const getParalegalStatus = (status: string) => {
    switch (status) {
      case "online": return "bg-success";
      case "busy": return "bg-warning";
      case "offline": return "bg-muted";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {caseData.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{caseData.client}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Assign Task</DropdownMenuItem>
              <DropdownMenuItem>Send Message</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Archive Case</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", getStatusColor(caseData.status))}>
            {caseData.status}
          </Badge>
          <Badge variant="outline" className={cn("text-xs", getPriorityColor(caseData.priority))}>
            {caseData.priority} priority
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Paralegal Assignment */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src={caseData.paralegal.avatar} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {caseData.paralegal.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                getParalegalStatus(caseData.paralegal.status)
              )} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{caseData.paralegal.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{caseData.paralegal.status}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{caseData.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-500 ease-out"
              style={{ width: `${caseData.progress}%` }}
            />
          </div>
        </div>

        {/* Case Metrics */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{caseData.tasksCount}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              <span>{caseData.messagesCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{caseData.lastActivity}</span>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Deadline</span>
          </div>
          <span className="text-sm font-medium text-foreground">{caseData.deadline}</span>
        </div>
      </CardContent>
    </Card>
  );
}

const mockCases = [
  {
    id: "1",
    name: "Personal Injury - Johnson v. Tech Corp",
    client: "Michael Johnson",
    paralegal: {
      name: "Sarah Chen",
      avatar: "",
      status: "online" as const
    },
    status: "active" as const,
    priority: "high" as const,
    deadline: "Jan 25, 2025",
    progress: 75,
    lastActivity: "2h ago",
    tasksCount: 8,
    messagesCount: 12
  },
  {
    id: "2",
    name: "Estate Planning - Williams Family Trust",
    client: "Robert Williams",
    paralegal: {
      name: "David Kumar",
      avatar: "",
      status: "busy" as const
    },
    status: "review" as const,
    priority: "medium" as const,
    deadline: "Feb 2, 2025",
    progress: 90,
    lastActivity: "1h ago",
    tasksCount: 5,
    messagesCount: 8
  },
  {
    id: "3",
    name: "Real Estate - Commercial Property Sale",
    client: "Metro Properties LLC",
    paralegal: {
      name: "Lisa Rodriguez",
      avatar: "",
      status: "online" as const
    },
    status: "pending" as const,
    priority: "high" as const,
    deadline: "Jan 30, 2025",
    progress: 45,
    lastActivity: "30m ago",
    tasksCount: 12,
    messagesCount: 6
  },
  {
    id: "4",
    name: "Family Law - Custody Agreement",
    client: "Jennifer Davis",
    paralegal: {
      name: "Mark Thompson",
      avatar: "",
      status: "offline" as const
    },
    status: "active" as const,
    priority: "medium" as const,
    deadline: "Feb 5, 2025",
    progress: 60,
    lastActivity: "4h ago",
    tasksCount: 6,
    messagesCount: 15
  }
];

export function ActiveCases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCases = mockCases.filter(caseData => {
    const matchesSearch = caseData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseData.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || caseData.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">Active Cases</CardTitle>
            <p className="text-muted-foreground mt-1">Manage and track case progress</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Cases</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("review")}>In Review</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {filteredCases.map((caseData, index) => (
            <div
              key={caseData.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CaseCard case={caseData} />
            </div>
          ))}
        </div>
        
        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No cases found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}