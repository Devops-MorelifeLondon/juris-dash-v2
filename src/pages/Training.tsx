import React, { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api/config";
import { Layout } from "@/components/ui/layout";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Icons
import {
  Mic, MicOff, UploadCloud, FileText, Video,
  X, Download, Eye, Loader2, File, Calendar,
  Users, ArrowRight
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SectionTrain = () => {
  // ---------------- State ----------------
  const [files, setFiles] = useState([]);
  // videos: wrapper objects -> { isUrl: false, file } or { isUrl: true, url }
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Paralegal Template");
  const [assignedTo, setAssignedTo] = useState("Both");
  const [priority, setPriority] = useState("Low");
  const [description, setDescription] = useState("");
  const [paralegals, setParalegals] = useState([]);
  const [selectedParalegals, setSelectedParalegals] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Speech
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const navigate = useNavigate();

  // ---------------- Logic ----------------
  const startListening = (field) => {
    if (typeof window !== "undefined" && !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.lang = "en-IN";
    rec.interimResults = false;
    setIsListening(true);
    setActiveField(field);
    rec.start();
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      if (field === "documentName") {
        setDocumentName((prev) => (prev ? prev + " " + text : text));
      } else {
        setDescription((prev) => (prev ? prev + " " + text : text));
      }
    };
    rec.onend = () => {
      setIsListening(false);
      setActiveField(null);
    };
  };

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get("/api/training/history");
      if (res.data.success) {
        setUploadHistory(
          res.data.data.map((d) => ({
            ...d,
            createdAt: new Date(d.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
      toast.error("Failed to fetch history");
    }
  };

  const loadParalegals = async () => {
    try {
      const res = await apiClient.get("/api/paralegals/linked");
      if (res.data.success) setParalegals(res.data.data);
    } catch (error) {
      console.error("Failed to fetch paralegals");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (assignedTo === "Paralegal" || assignedTo === "Both") {
      loadParalegals();
    }
  }, [assignedTo]);

  const handleParalegalToggle = (id) => {
    setSelectedParalegals((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));
  const removeVideo = (index) => setVideos(videos.filter((_, i) => i !== index));

  // ----------------- File / Video Input Handlers -----------------
  const handleFilesSelected = (e) => {
    const chosen = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...chosen]);
  };

  const handleVideosSelected = (e) => {
    const chosen = Array.from(e.target.files || []).map((f) => ({ isUrl: false, file: f }));
    setVideos((prev) => [...prev, ...chosen]);
  };

  const handleAddVideoUrl = () => {
    if (!videoUrl || !/^https?:\/\//i.test(videoUrl.trim())) {
      toast.error("Enter a valid URL");
      return;
    }
    setVideos((prev) => [...prev, { isUrl: true, url: videoUrl.trim() }]);
    setVideoUrl("");
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiresParalegal = assignedTo === "Paralegal" || assignedTo === "Both";
    if (requiresParalegal && selectedParalegals.length === 0) {
      toast.error("Please select at least one paralegal to assign this material.");
      return;
    }

    setIsUploading(true);
    let uploadedFiles = [];
    let uploadedVideos = [];

    try {
      // Upload Documents -> same as before (files array are raw File objects)
      for (let f of files) {
        const res = await apiClient.post("/api/training/generate-file-upload-url", {
          fileName: f.name,
          fileType: f.type || "application/octet-stream",
        });
        await fetch(res.data.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": f.type || "application/octet-stream" },
          body: f,
        });
        uploadedFiles.push({
          filePath: res.data.key,
          originalFileName: f.name,
          fileType: f.type,
          fileSize: f.size,
          s3Url: res.data.uploadUrl.split("?")[0],
        });
      }

      // Upload / register Videos -> handle both uploaded files and URLs
      for (let v of videos) {
        if (v.isUrl) {
          // External URL — no upload
          uploadedVideos.push({
            isUrl: true,
            url: v.url,
          });
        } else {
          // v.file is a File
          const fileObj = v.file;
          const res = await apiClient.post("/api/training/generate-video-upload-url", {
            fileName: fileObj.name,
            fileType: fileObj.type || "video/mp4",
            fileSize: fileObj.size,
          });
          await fetch(res.data.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": fileObj.type || "video/mp4" },
            body: fileObj,
          });
          uploadedVideos.push({
            isUrl: false,
            filePath: res.data.key,
            originalFileName: fileObj.name,
            fileType: fileObj.type,
            fileSize: fileObj.size,
            s3Url: res.data.uploadUrl.split("?")[0],
          });
        }
      }

      // Save Metadata
      await apiClient.post("/api/training/save-metadata", {
        documentName,
        documentType,
        assignedTo,
        priority,
        description,
        paralegalAssignedTo: selectedParalegals,
        files: uploadedFiles,
        videos: uploadedVideos,
      });

      toast.success("Training material uploaded successfully!");

      // reset form
      setFiles([]);
      setVideos([]);
      setVideoUrl("");
      setDocumentName("");
      setDescription("");
      setSelectedParalegals([]);
      fetchHistory();
    } catch (err) {
      console.error("Upload error", err);
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getSignedUrl = async (key) => {
    const res = await apiClient.get(`/api/training/file-url?key=${encodeURIComponent(key)}`);
    return res.data.url;
  };

  const handlePreview = async (fileEntry) => {
    try {
      if (fileEntry.isUrl) {
        window.open(fileEntry.url, "_blank");
        return;
      }
      const url = await getSignedUrl(fileEntry.filePath);
      window.open(url, "_blank");
    } catch (e) {
      toast.error("Could not generate preview URL");
    }
  };

  const handleDownload = async (fileEntry) => {
    try {
      if (fileEntry.isUrl) {
        window.open(fileEntry.url, "_blank");
        return;
      }
      const url = await getSignedUrl(fileEntry.filePath);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileEntry.originalFileName || "download");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      toast.error("Could not download file");
    }
  };

  // ---------------- Helper for Table Cell ----------------
  const AttachmentList = ({ items, icon: Icon, typeLabel }) => {
    if (!items || items.length === 0) return <span className="text-muted-foreground text-xs">-</span>;

    return (
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-muted/30 p-2 rounded-md border border-muted">
            <div className="flex items-center gap-2 overflow-hidden mr-2">
              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-medium truncate max-w-[140px] lg:max-w-[220px]" title={item.originalFileName || item.url}>
                {item.isUrl ? item.url : item.originalFileName}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={(e) => { e.preventDefault(); handlePreview(item); }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Preview {typeLabel}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={(e) => { e.preventDefault(); handleDownload(item); }}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Download {typeLabel}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ---------------- Render ----------------
  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Training Center</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Upload new materials to train the AI assistant.
          </p>
        </div>

        {/* ---------------- FORM CARD ---------------- */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Upload Material</CardTitle>
            <CardDescription>Fill in the details below.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Document Name</Label>
                  <div className="relative">
                    <Input
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="e.g. Annual Compliance Report"
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full text-muted-foreground hover:text-primary"
                      onClick={() => isListening ? setIsListening(false) : startListening("documentName")}
                    >
                      {isListening && activeField === "documentName" ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paralegal Template">Paralegal Template</SelectItem>
                      <SelectItem value="AI Draft">AI Draft</SelectItem>
                      <SelectItem value="SOP">SOP</SelectItem>
                      <SelectItem value="Research Material">Research Material</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Both">Both AI & Paralegal</SelectItem>
                      <SelectItem value="AI">AI Only</SelectItem>
                      <SelectItem value="Paralegal">Paralegal Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* --- PARALEGAL SELECTION / EMPTY STATE --- */}
              {(assignedTo === "Paralegal" || assignedTo === "Both") && (
                <div className="space-y-2">
                  <Label>Assign to Paralegals <span className="text-red-500">*</span></Label>

                  {paralegals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/30 text-center space-y-3">
                      <Users className="h-10 w-10 text-muted-foreground/50" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">No dedicated paralegals found.</p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          You need to add a task first. Once a paralegal accepts your task, they will appear here.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/tasks")}
                      >
                        Go to Tasks <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-32 rounded-md border p-4 bg-background">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {paralegals.map((p) => (
                          <div key={p._id} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded transition-colors">
                            <Checkbox id={p._id} checked={selectedParalegals.includes(p._id)} onCheckedChange={() => handleParalegalToggle(p._id)} />
                            <Label htmlFor={p._id} className="text-sm font-normal cursor-pointer w-full">{p.firstName} {p.lastName}</Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Description</Label>
                <div className="relative">
                  <Textarea className="min-h-[80px] pr-10" placeholder="Add context..." value={description} onChange={(e) => setDescription(e.target.value)} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 text-muted-foreground" onClick={() => isListening ? setIsListening(false) : startListening("description")}>
                    {isListening && activeField === "description" ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Documents</Label>
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all text-center h-32">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to Upload Docs</p>
                    <span className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT</span>
                  </div>
                  <input type="file" multiple accept=".pdf,.docx,.txt" className="hidden" ref={fileInputRef} onChange={handleFilesSelected} />
                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-muted/40 p-2 px-3 rounded border">
                          <div className="flex items-center gap-2 overflow-hidden"><File className="h-3 w-3 flex-shrink-0" /><span className="truncate max-w-[150px]">{f.name}</span></div>
                          <Button size="icon" variant="ghost" className="h-6 w-6 flex-shrink-0" onClick={() => removeFile(i)}><X className="h-3 w-3" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Videos</Label>

                  <div onClick={() => videoInputRef.current?.click()} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all text-center h-32">
                    <Video className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to Upload Videos</p>
                    <span className="text-xs text-muted-foreground mt-1">MP4, MKV</span>
                  </div>
                  <input type="file" multiple accept="video/*" className="hidden" ref={videoInputRef} onChange={handleVideosSelected} />

                  <div className="flex gap-2 items-center mt-2">
                    <Input placeholder="Paste YouTube / Vimeo / Drive link..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                    <Button type="button" size="sm" onClick={handleAddVideoUrl}>Add URL</Button>
                  </div>

                  {videos.length > 0 && (
                    <div className="space-y-2">
                      {videos.map((v, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-muted/40 p-2 px-3 rounded border">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Video className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">
                              {v.isUrl ? v.url : v.file.name}
                            </span>
                          </div>
                          <Button size="icon" variant="ghost" className="h-6 w-6 flex-shrink-0" onClick={() => removeVideo(i)}><X className="h-3 w-3" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto md:px-8" disabled={isUploading}>
                {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : <><UploadCloud className="mr-2 h-4 w-4" /> Upload & Train</>}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* ---------------- HISTORY TABLE ---------------- */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle>History</CardTitle>
            <CardDescription>Manage your uploaded files and videos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[800px] md:min-w-full">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">Details</TableHead>
                    <TableHead className="min-w-[300px]">Documents</TableHead>
                    <TableHead className="min-w-[300px]">Videos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No history found.</TableCell>
                    </TableRow>
                  ) : (
                    uploadHistory.map((item) => (
                      <TableRow key={item._id} className="hover:bg-transparent">
                        {/* Col 1: Meta Info */}
                        <TableCell className="align-top py-4">
                          <div className="flex flex-col gap-2">
                            <span className="font-semibold text-base text-foreground">{item.documentName}</span>
                            <Badge variant="outline" className="w-fit font-normal">{item.documentType}</Badge>
                            <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              {item.createdAt}
                            </div>
                          </div>
                        </TableCell>

                        {/* Col 2: Files List */}
                        <TableCell className="align-top py-4">
                          <AttachmentList items={item.files} icon={FileText} typeLabel="File" />
                        </TableCell>

                        {/* Col 3: Videos List */}
                        <TableCell className="align-top py-4">
                          <AttachmentList items={item.videos} icon={Video} typeLabel="Video" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
};

export { SectionTrain };
