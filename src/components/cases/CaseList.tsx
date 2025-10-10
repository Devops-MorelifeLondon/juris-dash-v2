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
import { Search, Plus, Calendar, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const CaseList: React.FC<CaseListProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onCreateNew,
  filters,
  onFiltersChange,
}) => {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Low: "bg-blue-100 text-blue-800 border-blue-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      High: "bg-orange-100 text-orange-800 border-orange-200",
      Urgent: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      New: "bg-purple-100 text-purple-800 border-purple-200",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
      "Pending Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Completed: "bg-green-100 text-green-800 border-green-200",
      "On Hold": "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No deadline";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cases</h2>
          <Button onClick={onCreateNew} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Case
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9"
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
            <SelectTrigger className="text-xs">
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
            <SelectTrigger className="text-xs">
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
        <div className="p-2 space-y-2">
          {cases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No cases found</p>
            </div>
          ) : (
            cases.map((caseItem) => (
              <Card
                key={caseItem._id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedCaseId === caseItem._id
                    ? "border-primary bg-primary/5"
                    : "hover:border-gray-300"
                }`}
                onClick={() => onSelectCase(caseItem)}
              >
                <div className="space-y-3">
                  {/* Case Number & Name */}
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">
                      #{caseItem.caseNumber}
                    </div>
                    <h3 className="font-semibold text-sm mt-1 line-clamp-1">
                      {caseItem.name}
                    </h3>
                  </div>

                  {/* Client */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="line-clamp-1">
                      {caseItem.client?.name || "Unknown Client"}
                    </span>
                  </div>

                  {/* Status & Priority Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(caseItem.status)}`}
                    >
                      {caseItem.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(caseItem.priority)}`}
                    >
                      {caseItem.priority}
                    </Badge>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(caseItem.deadline)}</span>
                  </div>

                  {/* Service Type */}
                  <div className="text-xs text-muted-foreground truncate">
                    {caseItem.serviceType}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CaseList;
