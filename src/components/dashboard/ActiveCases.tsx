// src/components/dashboard/ActiveCases.tsx
import { useState } from "react";
import { 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  AlertTriangle,
  FileText,
  MessageCircle,
  Search,
  Filter,
  Loader2
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
import { useCases } from "@/hooks/useCases";
import { Case } from "@/types/case.types";
import { format, formatDistanceToNow } from "date-fns";
import { caseService } from "@/lib/api/caseService";
import { toast } from "sonner";

interface CaseCardProps {
  case: Case;
  onUpdate: () => void;
}

function CaseCard({ case: caseData, onUpdate }: CaseCardProps) {
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-info text-info-foreground";
      case "Pending": return "bg-warning text-warning-foreground";
      case "Review": return "bg-primary text-primary-foreground";
      case "Completed": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": case "Critical": return "text-destructive border-destructive/20";
      case "Medium": return "text-warning border-warning/20";
      case "Low": return "text-success border-success/20";
      default: return "text-muted-foreground border-border";
    }
  };

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this case?')) return;
    
    try {
      setUpdating(true);
      await caseService.archiveCase(caseData._id);
      toast.success('Case archived successfully');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to archive case');
    } finally {
      setUpdating(false);
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
            <p className="text-sm text-muted-foreground">{caseData.client.name}</p>
            <p className="text-xs text-muted-foreground">{caseData.caseNumber}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={updating}>
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.location.href = `/cases/${caseData._id}`}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = `/tasks?caseId=${caseData._id}`}>
                View Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive} className="text-destructive">
                Archive Case
              </DropdownMenuItem>
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
        {caseData.paralegal && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {caseData.paralegal.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{caseData.paralegal.fullName}</p>
                <p className="text-xs text-muted-foreground">Assigned Paralegal</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Hours Spent</span>
            <span className="font-medium text-foreground">{caseData.actualHoursSpent}h</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min((caseData.actualHoursSpent / (caseData.estimatedHours || caseData.actualHoursSpent || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Case Metrics */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{caseData.serviceType}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{formatDistanceToNow(new Date(caseData.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Deadline</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {format(new Date(caseData.deadline), 'MMM dd, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActiveCases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { cases, loading, error, refetch } = useCases({
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchQuery || undefined,
  });

  const filteredCases = cases.filter(caseData => 
    statusFilter === "all" || caseData.status === statusFilter
  );

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
                <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Review")}>In Review</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Error loading cases</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch}>Retry</Button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {filteredCases.map((caseData, index) => (
                <div
                  key={caseData._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CaseCard case={caseData} onUpdate={refetch} />
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
