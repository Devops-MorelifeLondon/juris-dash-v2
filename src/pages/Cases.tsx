import React, { useState } from "react";
import { Layout } from "@/components/ui/layout";
import { Case } from "@/components/cases/types";
import CaseList from "@/components/cases/CaseList";
import CaseDetails from "@/components/cases/CaseDetails";
import CaseForm from "@/components/cases/CaseForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Users, Clock, AlertCircle, Menu, X } from "lucide-react";

const initialCases: Case[] = [
  {
    id: "case-001",
    name: "Smith vs. Smith Divorce Proceeding",
    client: "John Smith",
    paralegal: "Alice Richardson",
    status: "In Progress",
    deadline: "2025-10-25",
    serviceType: "Family Law",
    priority: "High",
    timeSpent: 24.5,
    budget: 15000,
    createdDate: "2025-09-01",
    lastUpdated: "2025-09-25",
    documents: [
      {
        id: "doc1",
        title: "Divorce Petition Draft v2",
        type: "Draft",
        aiSuggestions: "Citation format needs correction on page 3. Consider adding precedent case Johnson v. Johnson (2023).",
        sopCompliant: false,
        uploadDate: "2025-09-20",
        paralegalName: "Alice Richardson",
        revisionCount: 2,
        fileSize: "245 KB",
        status: "Needs Revision"
      },
      {
        id: "doc2",
        title: "Asset Valuation Report",
        type: "Final",
        aiSuggestions: "Document compliant with firm standards.",
        sopCompliant: true,
        uploadDate: "2025-09-18",
        paralegalName: "Alice Richardson",
        revisionCount: 1,
        fileSize: "1.2 MB",
        status: "Approved"
      }
    ],
    tasks: [
      {
        id: "task1",
        description: "Draft divorce petition with property division",
        type: "Drafting",
        timeSpentMinutes: 180,
        completed: true,
        dueDate: "2025-09-22",
        paralegalAssigned: "Alice Richardson",
        priority: "High",
        aiAssisted: true
      },
      {
        id: "task2",
        description: "Research precedent cases for custody arrangements",
        type: "Research",
        timeSpentMinutes: 120,
        completed: false,
        dueDate: "2025-09-28",
        paralegalAssigned: "Alice Richardson",
        priority: "Medium",
        aiAssisted: true
      }
    ],
    communications: [
      {
        id: "msg1",
        from: "Attorney Johnson",
        to: "Alice Richardson",
        message: "Please update the citations in the divorce petition. The format should follow Bluebook 21st edition standards.",
        timestamp: "2025-09-20T12:34:00",
        type: "Internal"
      },
      {
        id: "msg2",
        from: "Alice Richardson",
        to: "Attorney Johnson",
        message: "Revision completed. AI compliance check shows 98% SOP adherence. Ready for review.",
        timestamp: "2025-09-21T09:15:00",
        type: "Internal"
      }
    ],
    notes: "Complex case involving significant assets. Client is cooperative. Opposing counsel is requesting mediation."
  },
  {
    id: "case-002",
    name: "Jones Real Estate Purchase Contract",
    client: "Mary Jones",
    paralegal: "Bob Kumar",
    status: "Open",
    deadline: "2025-11-10",
    serviceType: "Real Estate",
    priority: "Medium",
    timeSpent: 3.2,
    budget: 5000,
    createdDate: "2025-09-15",
    lastUpdated: "2025-09-26",
    documents: [],
    tasks: [
      {
        id: "task3",
        description: "Review purchase agreement terms",
        type: "Review",
        timeSpentMinutes: 90,
        completed: false,
        dueDate: "2025-09-30",
        paralegalAssigned: "Bob Kumar",
        priority: "Medium",
        aiAssisted: false
      }
    ],
    communications: [],
    notes: "Standard residential purchase. No complications expected."
  }
];

export default function CaseManagementPage() {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [selectedCase, setSelectedCase] = useState<Case | null>(initialCases[0]);
  const [view, setView] = useState<"details" | "edit" | "new">("details");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "All",
    paralegal: "All",
    serviceType: "All",
    priority: "All"
  });

  const handleSave = (caseToSave: Case) => {
    if (view === "new") {
      const newCase = { 
        ...caseToSave, 
        id: `case-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        timeSpent: 0
      };
      setCases([newCase, ...cases]);
      setSelectedCase(newCase);
    } else {
      const updatedCase = {
        ...caseToSave,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setCases(cases.map((c) => (c.id === caseToSave.id ? updatedCase : c)));
      setSelectedCase(updatedCase);
    }
    setView("details");
    setIsMobileMenuOpen(false);
  };

  const handleSelectCase = (caseToSelect: Case) => {
    setSelectedCase(caseToSelect);
    setView("details");
    setIsMobileMenuOpen(false);
  };

  const filteredCases = cases.filter(c => {
    return (filters.status === "All" || c.status === filters.status) &&
           (filters.paralegal === "All" || c.paralegal === filters.paralegal) &&
           (filters.serviceType === "All" || c.serviceType === filters.serviceType) &&
           (filters.priority === "All" || c.priority === filters.priority);
  });

  // Calculate dashboard stats
  const stats = {
    totalCases: cases.length,
    activeCases: cases.filter(c => c.status === "In Progress").length,
    pendingReview: cases.filter(c => c.documents.some(d => d.status === "Needs Revision")).length,
    overdueDeadlines: cases.filter(c => new Date(c.deadline) < new Date()).length
  };

  const renderMainContent = () => {
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
              setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
              setSelectedCase(updatedCase);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full rounded-lg bg-muted/50">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Select a case to view its details or create a new one.</p>
            </div>
          </div>
        );
    }
  };

  const CaseListComponent = () => (
    <CaseList
      cases={filteredCases}
      selectedCaseId={selectedCase?.id}
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
        {/* Mobile Header - Visible only on mobile */}
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

        {/* Page Header with Stats - Always visible but different on mobile */}
        <div className="flex-none p-4 md:p-6 border-b bg-background rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="hidden lg:block">
              <h1 className="text-2xl font-semibold tracking-tight">Cases Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track all legal cases with AI-powered insights
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">{stats.totalCases}</div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-blue-600">{stats.activeCases}</div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-red-600">{stats.overdueDeadlines}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-[600px]">
          <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* Case List - Desktop only */}
            <div className="hidden lg:block w-full lg:w-96 xl:w-[400px] flex-shrink-0">
              <div className="h-full bg-background border rounded-lg">
                <CaseListComponent />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
              <div className="h-full bg-background border rounded-lg">
                <div className="h-full overflow-y-auto p-2">
                  {renderMainContent()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation - Visible only on mobile */}
        <div className="lg:hidden">
          <div className="bg-background border rounded-lg p-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={view === "details" ? "default" : "outline"}
                size="default"
                onClick={() => setView("details")}
                disabled={!selectedCase}
                className="w-full"
              >
                Details
              </Button>
              <Button
                variant={view === "edit" ? "default" : "outline"}
                size="default"
                onClick={() => setView("edit")}
                disabled={!selectedCase}
                className="w-full"
              >
                Edit
              </Button>
              <Button
                variant={view === "new" ? "default" : "outline"}
                size="default"
                onClick={() => {
                  setSelectedCase(null);
                  setView("new");
                }}
                className="w-full"
              >
                New Case
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
