// @/components/cases/CaseList.tsx

import React from "react";
import { Case } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Calendar, User, Briefcase } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CaseListProps {
  cases: Case[];
  selectedCaseId?: string;
  onSelectCase: (caseData: Case) => void;
  onCreateNew: () => void;
  filters: {
    status: string;
    paralegal: string;
    serviceType: string;
    priority: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  allCases: Case[];
}

const getPriorityClasses = (priority: string) => {
  switch (priority) {
    case "Low":
      return { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" };
    case "Medium":
      return { dot: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50" };
    case "High":
      return { dot: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-50" };
    case "Urgent":
      return { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" };
    default:
      return { dot: "bg-gray-500", text: "text-gray-700", bg: "bg-gray-50" };
  }
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "New":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending Review":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "On Hold":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const CaseList: React.FC<CaseListProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onCreateNew,
  filters,
  onFiltersChange,
}) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No deadline";
    const d = new Date(date);
    // --- THIS IS THE FIX ---
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-3 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Cases</h2>
          <Button onClick={onCreateNew} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Case
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-8 h-9"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value })
            }
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, priority: value })
            }
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Case List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1.5">
          {cases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Briefcase className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p>No cases found</p>
              <p className="text-xs">Try adjusting your filters.</p>
            </div>
          ) : (
            cases.map((caseItem) => {
              const priorityClasses = getPriorityClasses(caseItem.priority);
              return (
                <Card
                  key={caseItem._id}
                  className={cn(
                    "p-3 cursor-pointer transition-all rounded-lg",
                    "hover:shadow-sm hover:border-gray-300",
                    selectedCaseId === caseItem._id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-transparent"
                  )}
                  onClick={() => onSelectCase(caseItem)}
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {caseItem.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs px-1.5 py-0.5 font-medium",
                          getStatusClasses(caseItem.status)
                        )}
                      >
                        {caseItem.status}
                      </Badge>
                    </div>

                    {/* Meta Row: Client & Priority */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {caseItem.client?.name || "Unknown Client"}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 flex-shrink-0 ml-2",
                          priorityClasses.text
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            priorityClasses.dot
                          )}
                        ></span>
                        <span>{caseItem.priority}</span>
                      </div>
                    </div>

                    {/* Bottom Row: Case # & Deadline */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-mono">#{caseItem.caseNumber}</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(caseItem.deadline)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CaseList;