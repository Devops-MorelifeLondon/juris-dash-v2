import React, { useState } from "react";
import { Layout } from "@/components/ui/layout";
import { Case } from "@/components/cases/types";
import CaseList from "@/components/cases/CaseList";
import CaseDetails from "@/components/cases/CaseDetails";
import CaseForm from "@/components/cases/CaseForm";

const initialCases: Case[] = [
  {
    id: "case-001",
    name: "Smith Divorce",
    client: "John Smith",
    paralegal: "Alice R.",
    status: "In Progress",
    deadline: "2025-10-25",
    serviceType: "Family Law",
    documents: [
      { id: "doc1", title: "Divorce Petition Draft", aiSuggestions: "Check citation format.", sopCompliant: false },
    ],
    tasks: [
      { id: "task1", description: "Draft divorce petition", timeSpentMinutes: 180, completed: true },
    ],
    communications: [
      { id: "msg1", from: "Attorney", message: "Please update citations.", timestamp: "2025-09-20T12:34:00" },
    ],
  },
  {
    id: "case-002",
    name: "Jones Real Estate Purchase",
    client: "Mary Jones",
    paralegal: "Bob K.",
    status: "Open",
    deadline: "2025-11-10",
    serviceType: "Real Estate",
    documents: [],
    tasks: [],
    communications: [],
  },
];

export default function CaseManagementPage() {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [selectedCase, setSelectedCase] = useState<Case | null>(initialCases[0]);
  const [view, setView] = useState<"details" | "edit" | "new">("details");

  const handleSave = (caseToSave: Case) => {
    if (view === "new") {
      setCases([{ ...caseToSave, id: `case-${Date.now()}` }, ...cases]);
    } else {
      setCases(cases.map((c) => (c.id === caseToSave.id ? caseToSave : c)));
    }
    setSelectedCase(caseToSave);
    setView("details");
  };

  const handleSelectCase = (caseToSelect: Case) => {
    setSelectedCase(caseToSelect);
    setView("details");
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
          <CaseDetails caseData={selectedCase} onEdit={() => setView("edit")} />
        ) : (
          <div className="flex items-center justify-center h-full rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Select a case to view its details or create a new one.</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      {/* 
        The main container is now flexible to fit within a parent dashboard layout.
        It uses `w-full` and `h-full` to adapt to the space provided by the `Layout` component.
      */}
      <div className="w-full h-full p-4 md:p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full">
          <CaseList
            cases={cases}
            selectedCaseId={selectedCase?.id}
            onSelectCase={handleSelectCase}
            onCreateNew={() => {
              setSelectedCase(null);
              setView("new");
            }}
          />
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 h-full overflow-y-auto">
          {renderMainContent()}
        </div>
      </div>
    </Layout>
  );
}
