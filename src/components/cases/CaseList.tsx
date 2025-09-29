import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlusCircle, Filter, Clock, AlertTriangle, ChevronDown, X, Search } from "lucide-react";
import { Case } from "./types";

interface CaseListProps {
  cases: Case[];
  selectedCaseId?: string | null;
  onSelectCase: (caseData: Case) => void;
  onCreateNew: () => void;
  filters: {
    status: string;
    paralegal: string;
    serviceType: string;
    priority: string;
  };
  onFiltersChange: (filters: any) => void;
  allCases: Case[];
}

export default function CaseList({ 
  cases, 
  selectedCaseId, 
  onSelectCase, 
  onCreateNew, 
  filters, 
  onFiltersChange,
  allCases 
}: CaseListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCases = cases.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.paralegal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUniqueValues = (key: keyof Case) => {
    return Array.from(new Set(allCases.map(c => c[key] as string))).filter(Boolean);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-500";
      case "In Progress": return "bg-yellow-500";
      case "Review": return "bg-purple-500";
      case "Closed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "All").length;

  const clearFilters = () => {
    onFiltersChange({
      status: "All",
      paralegal: "All",
      serviceType: "All",
      priority: "All"
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header - Responsive */}
      <div className="flex-none p-3 sm:p-4 lg:p-6 border-b">
        {/* Title and New Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base sm:text-lg">Cases</h3>
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {filteredCases.length}
            </Badge>
          </div>
          <Button 
            size="sm" 
            onClick={onCreateNew}
            className="px-3 py-2 h-8 sm:h-9"
          >
            <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Case</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases, clients, paralegals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 sm:h-10 text-sm"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between gap-2">
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 px-3"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                  <span className="sm:hidden">Filter</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                  <ChevronDown className={`h-3 w-3 ml-1 sm:ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 sm:h-9 px-2 sm:px-3 ml-2"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}

              {/* Collapsible Filters */}
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 sm:p-4 bg-muted/30 rounded-lg border">
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => onFiltersChange({...filters, status: value})}
                  >
                    <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      {getUniqueValues("status").map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.priority} 
                    onValueChange={(value) => onFiltersChange({...filters, priority: value})}
                  >
                    <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Priority</SelectItem>
                      {getUniqueValues("priority").map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.paralegal} 
                    onValueChange={(value) => onFiltersChange({...filters, paralegal: value})}
                  >
                    <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Paralegal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Paralegals</SelectItem>
                      {getUniqueValues("paralegal").map(paralegal => (
                        <SelectItem key={paralegal} value={paralegal}>{paralegal}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.serviceType} 
                    onValueChange={(value) => onFiltersChange({...filters, serviceType: value})}
                  >
                    <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Services</SelectItem>
                      {getUniqueValues("serviceType").map(service => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* Case List - Scrollable with responsive spacing */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className={`p-3 sm:p-4 rounded-lg cursor-pointer border transition-all hover:shadow-sm active:scale-95 ${
                selectedCaseId === c.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "hover:bg-muted/50 border-border hover:border-primary/20"
              }`}
            >
              <div className="space-y-2 sm:space-y-3">
                {/* Case Name & Overdue Indicator */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm sm:text-base leading-tight line-clamp-2 flex-1">
                    {c.name}
                  </h4>
                  {isOverdue(c.deadline) && (
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                </div>
                
                {/* Client & Paralegal - Responsive layout */}
                <div className="text-xs sm:text-sm opacity-80 space-y-1">
                  <div className="font-medium">{c.client}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
                    <span>{c.paralegal}</span>
                  </div>
                </div>
                
                {/* Status & Priority Badges - Responsive */}
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <Badge 
                    className={`${getStatusColor(c.status)} text-white text-xs px-2 py-1 h-5 sm:h-6`}
                  >
                    {c.status}
                  </Badge>
                  <Badge 
                    className={`${getPriorityColor(c.priority)} text-white text-xs px-2 py-1 h-5 sm:h-6 border-0`}
                  >
                    {c.priority}
                  </Badge>
                </div>

                {/* Deadline & Time - Responsive layout */}
                <div className="flex items-center justify-between text-xs sm:text-sm opacity-75 pt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className={`${isOverdue(c.deadline) ? 'text-red-500 font-medium' : ''}`}>
                      {new Date(c.deadline).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: window.innerWidth < 640 ? '2-digit' : 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="text-xs font-medium">
                    {c.timeSpent}h
                  </div>
                </div>

                {/* Service Type - Show on larger screens or when selected */}
                <div className={`text-xs opacity-60 ${selectedCaseId === c.id || window.innerWidth >= 640 ? 'block' : 'hidden sm:block'}`}>
                  {c.serviceType}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredCases.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-medium">No cases found</p>
                <p className="text-xs sm:text-sm opacity-75">
                  {searchTerm || activeFiltersCount > 0 
                    ? "Try adjusting your search or filters"
                    : "Create your first case to get started"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Quick Actions - Only visible on mobile when no case selected */}
      <div className="sm:hidden flex-none border-t p-3">
        {!selectedCaseId && (
          <Button 
            onClick={onCreateNew}
            className="w-full"
            size="default"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Case
          </Button>
        )}
      </div>
    </div>
  );
}
