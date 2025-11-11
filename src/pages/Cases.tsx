// @/pages/CaseManagementPage.tsx (or similar)

import React, { useEffect, useState } from "react";
import { Layout } from "@/components/ui/layout";
import { Case } from "@/components/cases/types";
import CaseList from "@/components/cases/CaseList";
import CaseDetails from "@/components/cases/CaseDetails";
import CaseForm from "@/components/cases/CaseForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Users, Clock, AlertCircle, Menu, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/config";

// Note: Removed unused imports like axios, Cookies
// Note: Keeping Toaster, but it should be in your root Layout, not here.

export default function CaseManagementPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [view, setView] = useState<"details" | "edit" | "new">("details");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial load
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "All", // Default to "All"
    paralegal: "All",
    serviceType: "All",
    priority: "All",
    search: "",
    page: 1,
    limit: 20, // Fetch more
  });

  useEffect(() => {
    fetchCases();
  }, [
    filters.status,
    filters.priority,
    filters.serviceType,
    filters.search,
    filters.page,
  ]);

  const fetchCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "All")
        params.append("status", filters.status);
      if (filters.priority && filters.priority !== "All")
        params.append("priority", filters.priority);
      if (filters.serviceType && filters.serviceType !== "All")
        params.append("serviceType", filters.serviceType);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await apiClient.get(
        `/api/cases/my-cases?${params.toString()}`
      );

      const caseData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setCases(caseData);

      // If a case is already selected, find its updated version
      if (selectedCase) {
        const updatedSelected = caseData.find(c => c._id === selectedCase._id);
        setSelectedCase(updatedSelected || (caseData.length > 0 ? caseData[0] : null));
      } else if (caseData.length > 0) {
        // Otherwise, select the first case
        setSelectedCase(caseData[0]);
      } else {
        setSelectedCase(null);
      }

    } catch (err: any) {
      console.error("❌ Error fetching cases:", err);
      setError(
        err.response?.data?.message || "Failed to fetch cases. Please try again."
      );
      if (err.response?.status === 401) {
        toast.error("Authentication failed", {
          description: "Please login again to continue.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (savedCase: Case) => {
    // Optimistically update or add the case
    const caseExists = cases.some(c => c._id === savedCase._id);
    
    if (caseExists) {
      // Update
      setCases(cases.map(c => (c._id === savedCase._id ? savedCase : c)));
    } else {
      // Create
      setCases([savedCase, ...cases]);
    }
    
    setSelectedCase(savedCase);
    setView("details");
    setIsMobileMenuOpen(false);

    toast.success(`Case ${caseExists ? "updated" : "created"} successfully`, {
      description: `${savedCase.name} has been saved.`,
    });
    
    // Refresh all cases from server to get latest, including generated fields
    fetchCases();
  };
  
  const handleSelectCase = (caseToSelect: Case) => {
    setSelectedCase(caseToSelect);
    setView("details");
    setIsMobileMenuOpen(false);
  };
  
  const handleCreateNew = () => {
    setSelectedCase(null);
    setView("new");
    setIsMobileMenuOpen(false);
  }

  // Note: Local filtering is removed. We rely on the API to filter.
  // const filteredCases = cases; 
  // The 'cases' state is now *always* the filtered list from the API.

  const safeArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  // Recalculate stats based on the *fetched* cases
  const stats = {
    totalCases: cases.length, // This is total for the current filter
    activeCases: cases.filter((c) => c.status === "In Progress").length,
    pendingReview: cases.filter((c) => c.status === "Pending Review").length,
    overdueDeadlines: cases.filter((c) => {
      const deadline = c.deadline ? new Date(c.deadline) : null;
      return (
        deadline &&
        deadline < new Date() &&
        c.status !== "Completed"
      );
    }).length,
  };

  const renderMainContent = () => {
    if (isLoading && !selectedCase) { // Show full page loader only on initial load
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin" />
            <p>Loading cases...</p>
          </div>
        </div>
      );
    }

    if (error && !selectedCase) { // Show full page error if no cases loaded
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchCases}>Retry</Button>
          </div>
        </div>
      );
    }

    switch (view) {
      case "new":
      case "edit":
        return (
          <CaseForm
            caseData={view === "edit" ? selectedCase : null}
            onSave={handleSave}
            onCancel={() => {
              // If canceling 'new' and no case was selected, stay empty
              // If canceling 'new' and cases exist, select first
              // If canceling 'edit', just go back to details
              if(view === 'new' && !selectedCase && cases.length > 0) {
                setSelectedCase(cases[0]);
              }
              setView("details");
            }}
          />
        );
      case "details":
      default:
        return selectedCase ? (
          <CaseDetails
            caseData={selectedCase}
            onEdit={() => setView("edit")}
            onUpdateCase={(updatedCase) => {
              // This prop might be redundant if handleSave does the update
              setCases((prev) =>
                prev.map((c) => (c._id === updatedCase._id ? updatedCase : c))
              );
              setSelectedCase(updatedCase);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full rounded-lg bg-gray-50">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-muted-foreground text-sm">
                Select a case to view its details.
              </p>
            </div>
          </div>
        );
    }
  };

  const CaseListComponent = () => (
    <CaseList
      cases={cases} // Pass the fetched (and filtered) cases
      selectedCaseId={selectedCase?._id}
      onSelectCase={handleSelectCase}
      onCreateNew={handleCreateNew}
      filters={filters}
      onFiltersChange={setFilters}
      allCases={cases} // Pass 'cases' here too
    />
  );

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 p-4 md:p-6 space-y-6">
        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold">Cases Management</h1>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {selectedCase ? selectedCase.name : "Select a case"}
              </p>
            </div>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4 mr-1.5" />
                  Cases
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-96 p-0">
                <div className="flex items-center justify-between p-3 border-b">
                  <h2 className="text-base font-semibold">All Cases</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Full height for list in sheet */}
                <div className="h-[calc(100vh-65px)]">
                  <CaseListComponent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Stats Header */}
        <div className="flex-none">
          <div className="hidden lg:block mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Cases Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage and track all legal cases in one dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Cases
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold">{stats.totalCases}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Active
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.activeCases}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  In Review
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingReview}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Overdue
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold text-red-600">
                  {stats.overdueDeadlines}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* Sidebar List (Desktop) */}
            <div className="hidden lg:block w-full lg:w-96 xl:w-[400px] flex-shrink-0">
              <div className="h-full bg-background border rounded-lg overflow-hidden">
                <CaseListComponent />
              </div>
            </div>

            {/* Main Details (All Screens) */}
            <div className="flex-1 min-h-[600px]">
              <div className="h-full bg-background border rounded-lg overflow-y-auto">
                {renderMainContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}