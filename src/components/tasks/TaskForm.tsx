// src/components/tasks/TaskForm.tsx

import React, { useState, useEffect, useRef } from "react";
import { Task, TaskFormData } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  X,
  Save,
  XCircle,
  Loader2,
  Mic,
  MicOff,
  Paperclip,
  FileText,
  File,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/config";
import { format } from "date-fns"; // Added for date formatting

// --- Types ---
type Availability =
  | "Available Now"
  | "Available Soon"
  | "Fully Booked"
  | "Not Available";

interface TaskFormProps {
  taskData: Task | null;
  onSave: (data: any) => void; 
  onCancel: () => void;
}

interface Case {
  _id: string;
  name: string;
  caseNumber: string;
  status: string;
}

interface Paralegal {
  _id: string;
  fullName: string;
  available: Availability;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

export default function TaskForm({
  taskData,
  onSave,
  onCancel,
}: TaskFormProps) {
  // --- State ---
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    type: "Research",
    priority: "Medium",
    dueDate: "",
    estimatedHours: undefined,
    checklistItems: [],
    notes: "",
    tags: [],
  });

  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cases, setCases] = useState<Case[]>([]);
  const [paralegals, setParalegals] = useState<Paralegal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // File Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // State for opening existing files
  const [openingFileIndex, setOpeningFileIndex] = useState<number | null>(null);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<"title" | "description" | "notes" | null>(null);

  // --- Speech Logic ---
  const startListening = (field: "title" | "description" | "notes") => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    setIsListening(true);
    setActiveField(field);
    recognition.start();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      if (field === "title") setFormData((prev) => ({ ...prev, title: prev.title + " " + transcript }));
      else if (field === "description") setFormData((prev) => ({ ...prev, description: prev.description + " " + transcript }));
      else if (field === "notes") setFormData((prev) => ({ ...prev, notes: prev.notes + " " + transcript }));
    };

    recognition.onerror = () => {
      setIsListening(false);
      setActiveField(null);
    };
    recognition.onend = () => {
      setIsListening(false);
      setActiveField(null);
    };
  };

  const stopListening = () => {
    setIsListening(false);
    setActiveField(null);
  };

  // --- Effects ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const casesParams = new URLSearchParams({ page: "1", limit: "100" });
        const [casesResponse, paralegalsResponse] = await Promise.all([
          apiClient.get(`/api/cases/my-cases?${casesParams.toString()}`),
          apiClient.get(`/api/paralegals`),
        ]);

        if (casesResponse.data.success) {
          setCases(casesResponse.data.data.filter((c: Case) => !["Completed", "Cancelled", "Declined"].includes(c.status)));
        }
        if (paralegalsResponse.data.success) {
          setParalegals(paralegalsResponse.data.data.map((p: any) => ({
            _id: p._id,
            fullName: `${p.firstName} ${p.lastName}`,
            available: p.availability,
          })));
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (taskData) {
      setFormData({
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        priority: taskData.priority,
        dueDate: taskData.dueDate.split("T")[0],
        estimatedHours: taskData.estimatedHours,
        checklistItems: taskData.checklistItems,
        notes: taskData.notes || "",
        tags: taskData.tags,
      });
    }
  }, [taskData]);

  // --- Handlers ---
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Secure File Access Handler (Same as TaskDetails)
  const handleFileClick = async (e: React.MouseEvent, fileUrl: string, index: number) => {
    e.preventDefault(); 
    if (openingFileIndex !== null) return;

    setOpeningFileIndex(index);

    try {
      let key = "";
      try {
        const urlObj = new URL(fileUrl);
        key = urlObj.pathname.substring(1); 
      } catch (e) {
        toast.error("Invalid file URL format");
        setOpeningFileIndex(null);
        return;
      }

      const response = await apiClient.get(`/api/tasks/download-url?key=${encodeURIComponent(key)}`);
      
      if (response.data.success && response.data.url) {
        window.open(response.data.url, '_blank');
      } else {
        toast.error("Failed to generate secure link");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error accessing file.");
    } finally {
      setOpeningFileIndex(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare FormData for file upload
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("type", formData.type);
    submitData.append("priority", formData.priority);
    submitData.append("dueDate", formData.dueDate);
    submitData.append("domain", "Family Law");
    
    if (formData.estimatedHours) submitData.append("estimatedHours", formData.estimatedHours.toString());
    if (formData.notes) submitData.append("notes", formData.notes);
    
    // Arrays must be stringified for FormData
    submitData.append("checklistItems", JSON.stringify(formData.checklistItems));
    submitData.append("tags", JSON.stringify(formData.tags));

    // Append Files
    selectedFiles.forEach((file) => {
      submitData.append("documents", file);
    });

    onSave(submitData);
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData({ ...formData, checklistItems: [...formData.checklistItems, { text: newChecklistItem.trim(), completed: false }] });
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index: number) => {
    setFormData({ ...formData, checklistItems: formData.checklistItems.filter((_, i) => i !== index) });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading form...</p>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{taskData ? "Edit Task" : "Create New Task"}</CardTitle>
        </CardHeader>
        
        {/* Use ScrollArea with flex-1 to occupy remaining height */}
        <ScrollArea className="flex-1 h-[calc(100vh-250px)]">
          <CardContent className="space-y-4 pt-4 px-6 pb-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  className={errors.title ? "border-red-500" : ""}
                />
                <Button
                  type="button" size="icon" variant={activeField === "title" && isListening ? "destructive" : "outline"}
                  onClick={() => isListening && activeField === "title" ? stopListening() : startListening("title")}
                >
                  {isListening && activeField === "title" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <div className="flex gap-2 items-start">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                <Button
                  type="button" size="icon" variant={activeField === "description" && isListening ? "destructive" : "outline"}
                  onClick={() => isListening && activeField === "description" ? stopListening() : startListening("description")}
                  className="mt-1"
                >
                  {isListening && activeField === "description" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Type & Priority */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Drafting">Document Preparation</SelectItem>
                    <SelectItem value="Communication">Client Communication</SelectItem>
                    <SelectItem value="Filing">Court Filing</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date & Hours */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
                <Input
                  id="dueDate" type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={errors.dueDate ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours" type="number" min="0" step="0.5"
                  value={formData.estimatedHours || ""}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="e.g., 8"
                />
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <Label htmlFor="documents">Documents</Label>
              
              {/* New File Upload Button */}
              <div className="flex items-center gap-2">
                <Button
                  type="button" variant="outline"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Attach new documents"}
                </Button>
                <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
              </div>

              {/* Newly Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="grid gap-2">
                  <Label className="text-xs text-muted-foreground">New Uploads:</Label>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md border text-sm w-full overflow-hidden">
                      <div className="flex items-center min-w-0 flex-1">
                        <FileText className="h-4 w-4 mr-2 text-blue-500 shrink-0" />
                        <span className="truncate">{file.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground shrink-0">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} className="shrink-0 ml-2">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing Documents List (Interactive) */}
              {taskData && taskData.attachments && taskData.attachments.length > 0 && (
                <div className="grid gap-2">
                  <Label className="text-xs text-muted-foreground">Previously Uploaded:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {taskData.attachments.map((att: any, index: number) => (
                      <a
                        key={index}
                        href="#"
                        onClick={(e) => handleFileClick(e, att.url, index)}
                        className={cn(
                          "flex items-center p-2 border rounded-md transition-colors group bg-white cursor-pointer w-full overflow-hidden",
                          openingFileIndex === index ? "bg-gray-50" : "hover:bg-gray-50"
                        )}
                      >
                        <div className="p-1.5 bg-blue-50 rounded-md mr-3 group-hover:bg-blue-100 transition-colors shrink-0">
                          <File className="h-4 w-4 text-blue-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" title={att.name}>
                            {att.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                             {att.size && <span>{(att.size / 1024 / 1024).toFixed(2)} MB</span>}
                             {att.uploadedAt && <span>• {format(new Date(att.uploadedAt), "MMM d")}</span>}
                          </div>
                        </div>

                        {/* Loader / Icon */}
                        <div className="shrink-0 ml-2">
                          {openingFileIndex === index ? (
                            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <Label>Checklist Items</Label>
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add checklist item"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addChecklistItem())}
                />
                <Button type="button" onClick={addChecklistItem} size="sm"><Plus className="h-4 w-4" /></Button>
              </div>
              {formData.checklistItems.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={(checked) => {
                          const updated = [...formData.checklistItems];
                          updated[index] = { ...updated[index], completed: checked as boolean };
                          setFormData({ ...formData, checklistItems: updated });
                        }}
                      />
                      <span className="flex-1 text-sm">{item.text}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeChecklistItem(index)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm"><Plus className="h-4 w-4" /></Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded text-sm">
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(index)} className="hover:bg-primary/20 rounded-full p-1"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <div className="flex gap-2 items-start">
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
                <Button
                  type="button" size="icon" variant={activeField === "notes" && isListening ? "destructive" : "outline"}
                  onClick={() => isListening && activeField === "notes" ? stopListening() : startListening("notes")}
                  className="mt-1"
                >
                  {isListening && activeField === "notes" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </ScrollArea>

        <CardFooter className="flex gap-2 justify-end border-t pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            <XCircle className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {taskData ? "Update Task" : "Create Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}