import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Case } from "./types";

interface CaseListProps {
  cases: Case[];
  selectedCaseId?: string | null;
  onSelectCase: (caseData: Case) => void;
  onCreateNew: () => void;
}

export default function CaseList({ cases, selectedCaseId, onSelectCase, onCreateNew }: CaseListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCases = cases.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Cases</CardTitle>
        <Button size="sm" class onClick={onCreateNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-4">
        <Input
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="flex-grow overflow-y-auto">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className={`p-3 rounded-lg cursor-pointer mb-2 ${
                selectedCaseId === c.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <h4 className="font-semibold">{c.name}</h4>
              <p className={`text-sm ${selectedCaseId === c.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{c.client} - {c.status}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
