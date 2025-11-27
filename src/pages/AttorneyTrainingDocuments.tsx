"use client";

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Video,
  Search,
  ChevronRight,
  Plus,
  Users,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api/config";
import { Layout } from "@/components/ui/layout";

interface TrainingDocument {
  _id: string;
  documentName: string;
  documentType: string;
  priority: string;
  description: string;
  files: any[];
  videos: any[];
  createdAt: string;
  uploadedBy: string;
  assignedParalegals: string[]; // ID array
}

const AttorneyTrainingDocuments = () => {
  const [documents, setDocuments] = useState<TrainingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        // Ensure you have created this endpoint in your backend as discussed!
        const res = await apiClient.get("/api/training/attorney-assigned");
        setDocuments(res.data.documents);
      } catch (err) {
        toast.error("Failed to load your training modules");
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      default: return "secondary";
    }
  };

  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(
      (d) =>
        d.documentName.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

  return (
       <Layout>
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-end border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
                <Eye className="w-3 h-3" /> Supervisor View
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Training Monitoring</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Track progress and answer questions for modules you have assigned to paralegals.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assigned modules..."
              className="pl-9 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Optional: Quick link to create new if you have that page */}
          <Button onClick={() => navigate("/training")} className="gap-2">
            <Plus className="w-4 h-4" /> New Module
          </Button>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-muted/20 animate-pulse border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card
              key={doc._id}
              onClick={() => navigate(`/documents/attorney-training/${doc._id}`)}
              className="group hover:shadow-xl hover:-translate-y-1 hover:border-purple-500/30 cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />

              <CardHeader className="pb-3 relative">
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1.5 flex-1">
                    <Badge variant="outline" className="mb-2 bg-background/50 backdrop-blur-sm">
                      {doc.documentType}
                    </Badge>
                    <CardTitle className="leading-snug text-lg group-hover:text-purple-700 transition-colors line-clamp-2">
                      {doc.documentName}
                    </CardTitle>
                  </div>
                  <Badge variant={getPriorityColor(doc.priority)} className="shrink-0 shadow-sm">
                    {doc.priority}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative">
                <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed h-[60px]">
                  {doc.description}
                </p>
                
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                    <FileText className="w-3.5 h-3.5" />
                    {doc.files.length} Files
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                    <Video className="w-3.5 h-3.5" />
                    {doc.videos.length} Videos
                  </div>
                  {/* Show number of assignees if available */}
                  <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md ml-auto">
                    <Users className="w-3.5 h-3.5" />
                    {doc.assignedParalegals?.length || 0} Assigned
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 text-xs text-muted-foreground flex justify-between items-center border-t bg-muted/5 px-6 py-4">
                <div className="flex items-center gap-2">
                   <span className="italic">Created by you</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Monitor Progress <ChevronRight className="w-3 h-3" />
                </div>
              </CardFooter>
            </Card>
          ))}
          
          {filteredDocuments.length === 0 && (
             <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No training modules found.</p>
             </div>
          )}
        </div>
      )}
    </div>
    </Layout>
  );
};

export default AttorneyTrainingDocuments;