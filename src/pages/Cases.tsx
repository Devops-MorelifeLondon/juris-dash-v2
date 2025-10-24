import React, { useEffect, useState } from "react";
import { Layout } from "@/components/ui/layout";
import { Case } from "@/components/cases/types";
import CaseList from "@/components/cases/CaseList";
import CaseDetails from "@/components/cases/CaseDetails";
import CaseForm from "@/components/cases/CaseForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Users, Clock, AlertCircle, Menu, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { apiClient } from "@/lib/api/config";





export default function CaseManagementPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [view, setView] = useState<"details" | "edit" | "new">("details");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    paralegal: "",
    serviceType: "",
    priority: "",
    search: "",
    page: 1,
    limit: 10,
  });

  // Debug: Check if token exists on component mount
  useEffect(() => {
    const token = Cookies.get("token");
    console.log("🚀 Component mounted - Token check:", token ? "FOUND" : "NOT FOUND");
    if (!token) {
      console.warn("⚠️ WARNING: No authentication token found!");
      console.log("📝 Available cookies:", Object.keys(Cookies.get()));
    }
  }, []);

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
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.serviceType) params.append("serviceType", filters.serviceType);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      console.log("📡 Fetching cases with params:", params.toString());

      const response = await apiClient.get(
        `/api/cases/my-cases?${params.toString()}`
      );

      const caseData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setCases(caseData);

      if (!selectedCase && caseData.length > 0) {
        setSelectedCase(caseData[0]);
      }
    } catch (err: any) {
      console.error("❌ Error fetching cases:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      
      setError(
        err.response?.data?.message || "Failed to fetch cases. Please try again."
      );
      
      // If 401, show specific token error
      if (err.response?.status === 401) {
        toast.error("Authentication failed", {
          description: "Please login again to continue.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (caseToSave: Case) => {
    const now = new Date().toISOString().split("T")[0];

    if (view === "new") {
      const newCase = {
        ...caseToSave,
        _id: `temp-${Date.now()}`,
        createdDate: now,
        lastUpdated: now,
        timeSpent: 0,
      };
      setCases([newCase, ...cases]);
      setSelectedCase(newCase);
    } else {
      const updatedCase = { ...caseToSave, lastUpdated: now };
      setCases((prev) =>
        prev.map((c) => (c._id === updatedCase._id ? updatedCase : c))
      );
      setSelectedCase(updatedCase);
    }
    toast.success("Case created successfully", {
      description: `${caseToSave.name} has been added to your cases.`,
    });

    setView("details");
    setIsMobileMenuOpen(false);
  };

  const handleSelectCase = (caseToSelect: Case) => {
    setSelectedCase(caseToSelect);
    setView("details");
    setIsMobileMenuOpen(false);
  };

  const filteredCases = cases.filter((c) => {
    return (
      (!filters.status || filters.status === "All" || c.status === filters.status) &&
      (!filters.paralegal || filters.paralegal === "All" || c.paralegal === filters.paralegal) &&
      (!filters.serviceType || filters.serviceType === "All" || c.serviceType === filters.serviceType) &&
      (!filters.priority || filters.priority === "All" || c.priority === filters.priority)
    );
  });

  const safeArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  const stats = {
    totalCases: cases.length,
    activeCases: cases.filter((c) => c.status === "In Progress").length,
    pendingReview: cases.filter((c) =>
      safeArray(c.documents).some((d: any) => d.status === "Needs Revision")
    ).length,
    overdueDeadlines: cases.filter((c) => {
      const deadline = c.deadline ? new Date(c.deadline) : null;
      return deadline && deadline < new Date();
    }).length,
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">Loading cases...</p>
          </div>
        </div>
      );
    }

    if (error) {
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
            onCancel={() => setView("details")}
          />
        );
      case "details":
      default:
        return selectedCase ? (
          <CaseDetails
            caseData={selectedCase}
            onEdit={() => setView("edit")}
            onUpdateCase={(updatedCase) => {
              setCases((prev) =>
                prev.map((c) => (c._id === updatedCase._id ? updatedCase : c))
              );
              setSelectedCase(updatedCase);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full rounded-lg bg-muted/50">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Select a case to view its details or create a new one.
              </p>
            </div>
          </div>
        );
    }
  };

  const CaseListComponent = () => (
    <CaseList
      cases={filteredCases}
      selectedCaseId={selectedCase?._id}
      onSelectCase={handleSelectCase}
      onCreateNew={() => {
        setSelectedCase(null);
        setView("new");
      }}
      filters={filters}
      onFiltersChange={setFilters}
      allCases={cases}
    />
  );

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold">Cases Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedCase ? selectedCase.name : "Select a case"}
              </p>
            </div>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="default">
                  <Menu className="h-4 w-4 mr-2" />
                  Cases
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-96 p-0">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-lg font-semibold">All Cases</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[calc(100vh-80px)]">
                  <CaseListComponent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Stats Header */}
        <div className="flex-none p-4 md:p-6 border-b bg-background rounded-lg">
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Cases Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all legal cases with AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCases}</div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.activeCases}</div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingReview}
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.overdueDeadlines}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-[600px]">
          <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* Sidebar List */}
            <div className="hidden lg:block w-full lg:w-96 xl:w-[400px] flex-shrink-0">
              <div className="h-full bg-background border rounded-lg">
                <CaseListComponent />
              </div>
            </div>

            {/* Main Details */}
            <div className="flex-1 min-h-0">
              <div className="h-full bg-background border rounded-lg overflow-y-auto p-2">
                {renderMainContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
