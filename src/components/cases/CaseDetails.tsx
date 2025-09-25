import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, FileText, CheckCircle, XCircle } from "lucide-react";
import { Case } from "./types";

interface CaseDetailsProps {
  caseData: Case;
  onEdit: () => void;
}

export default function CaseDetails({ caseData, onEdit }: CaseDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{caseData.name}</CardTitle>
            <CardDescription>{caseData.client}</CardDescription>
          </div>
          <Button variant="outline" onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><p className="text-sm text-muted-foreground">Paralegal</p><p className="font-medium">{caseData.paralegal}</p></div>
          <div><p className="text-sm text-muted-foreground">Status</p><p className="font-medium">{caseData.status}</p></div>
          <div><p className="text-sm text-muted-foreground">Deadline</p><p className="font-medium">{new Date(caseData.deadline).toLocaleDateString()}</p></div>
          <div><p className="text-sm text-muted-foreground">Service</p><p className="font-medium">{caseData.serviceType}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
        <CardContent>
          {caseData.documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-2 border-b">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-muted-foreground">AI Suggestion: {doc.aiSuggestions}</p>
                </div>
              </div>
              {doc.sopCompliant ? (
                <div className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Compliant</div>
              ) : (
                <div className="flex items-center text-red-600"><XCircle className="h-4 w-4 mr-1" /> Non-Compliant</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      {/* Additional cards for Tasks and Communications can be added here */}
    </div>
  );
}
