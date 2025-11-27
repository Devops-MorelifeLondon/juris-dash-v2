"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Download,
  FileText,
  Video,
  ExternalLink,
  MessageCircle,
  SendHorizontal,
  PlayCircle,
  File,
  AlertCircle,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { apiClient } from "@/lib/api/config";
import { Layout } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

/* -------------------------------
   Types
--------------------------------*/

interface UserProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  role?: "Paralegal" | "Attorney" | string;
}

interface ReplyData {
  _id: string;
  message: string;
  repliedBy?: UserProfile | string;
  repliedByRole?: "Paralegal" | "Attorney" | string;
  createdAt: string;
}

interface FileComment {
  _id: string;
  message: string;
  createdBy?: UserProfile | string;
  creatorModel?: "Paralegal" | "Attorney";
  createdAt: string;
  replies: ReplyData[];
}

interface ProgressData {
  _id: string;
  paralegalId: UserProfile | string;
  percentageRead?: number;
  percentageWatched?: number;
  lastUpdated?: string;
}

interface TrainingItem {
  _id: string;
  filePath?: string;
  url?: string;
  isUrl?: boolean;
  originalFileName?: string;
  progress: ProgressData[];
  comments: FileComment[];
}

interface TrainingDocument {
  _id: string;
  documentName: string;
  documentType: string;
  priority: string;
  description: string;
  files: TrainingItem[];
  videos: TrainingItem[];
  createdAt: string;
  assignedTo: string;
  uploadedBy: string;
  assignedParalegals: UserProfile[];
}

/* -------------------------------
   Helper: Get Name & Initials
--------------------------------*/
const getDisplayName = (userObj: any): { name: string; initials: string } => {
  if (!userObj) return { name: "Unknown", initials: "?" };
  if (typeof userObj === "string")
    return { name: "User (Loading...)", initials: "?" };

  // Attorney
  if (userObj.fullName) {
    const parts = userObj.fullName.trim().split(/\s+/);
    const initials =
      parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0][0]?.toUpperCase() || "A";
    return { name: userObj.fullName, initials };
  }

  // Paralegal
  const fn = userObj.firstName || "";
  const ln = userObj.lastName || "";
  if (fn || ln) {
    const name = `${fn} ${ln}`.trim();
    const initials = (
      (fn ? fn[0] : "") + (ln ? ln[0] : "")
    ).toUpperCase() || "P";
    return { name: name || "Paralegal", initials };
  }

  if (userObj.email) {
    return {
      name: userObj.email,
      initials: userObj.email.charAt(0).toUpperCase(),
    };
  }

  return { name: "Unknown", initials: "?" };
};

/* -------------------------------
   Component: Progress Monitor
--------------------------------*/
const ProgressMonitor = ({
  value,
  type,
  lastUpdated,
  user,
}: {
  value: number;
  type: "read" | "watch";
  lastUpdated?: string;
  user: any;
}) => {
  const isComplete = value === 100;
  const { name, initials } = getDisplayName(user);

  return (
    <div className="bg-background/50 p-3 rounded-lg border border-border/50 shadow-sm hover:border-border transition-colors">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar className="w-6 h-6 shrink-0">
            <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <span className="text-sm font-medium truncate block">{name}</span>
          </div>
        </div>
        <Badge
            variant={isComplete ? "default" : "outline"}
            className={cn("text-[10px] h-5 px-1.5", isComplete && "bg-green-600 hover:bg-green-700 border-transparent")}
        >
            {isComplete ? "Done" : `${value}%`}
        </Badge>
      </div>

      <Progress value={value} className="h-1.5 w-full bg-muted" />

      <div className="flex justify-between items-center mt-1.5">
          <span className="text-[10px] text-muted-foreground">
             {type === "read" ? "Read" : "Watched"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {lastUpdated
            ? format(new Date(lastUpdated), "MMM d")
            : "--"}
        </span>
      </div>
    </div>
  );
};

/* -------------------------------
   Component: Comment Section (Flex Fixed)
--------------------------------*/
const CommentSection = ({
  comments,
  onAddComment,
  onReply,
  type,
}: {
  comments: FileComment[];
  onAddComment: (txt: string) => void;
  onReply: (txt: string, cId: string) => void;
  type: string;
}) => {
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  return (
    <div className="bg-background rounded-lg border shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b bg-muted/20 flex items-center gap-2 shrink-0">
        <MessageCircle className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs md:text-sm font-semibold">Discussion & Q&A</span>
        <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
          {comments.length}
        </Badge>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full w-full">
            <div className="p-4 space-y-5">
            {comments.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-10 opacity-50">
                <MessageCircle className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">No comments yet.</p>
                </div>
            )}

            {comments.map((c) => {
                const creator = (c as any).createdBy ?? (c as any).createdById ?? null;
                const { name, initials } = getDisplayName(creator);
                const roleLabel =
                (creator && (creator.role || (c as any).creatorModel)) || "User";

                return (
                <div key={c._id} className="group animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start gap-3">
                    <Avatar className="w-7 h-7 mt-1 shrink-0">
                        <AvatarFallback className="text-[10px] text-foreground bg-muted border">
                        {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-semibold truncate">{name}</span>
                        <Badge variant="outline" className="text-[9px] px-1 h-4">
                            {roleLabel}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
                            {format(new Date(c.createdAt), "MMM d, h:mm a")}
                        </span>
                        </div>

                        <div className="text-sm bg-muted/30 p-2.5 rounded-lg border text-foreground/90 break-words">
                        {c.message}
                        </div>

                        {/* Replies */}
                        {c.replies.length > 0 && (
                            <div className="mt-2 space-y-3 pl-2 border-l-2 border-border/50">
                            {c.replies.map((r) => {
                                const replier =
                                (r as any).repliedBy ?? (r as any).repliedById ?? null;
                                const rInfo = getDisplayName(replier);
                                const rRole =
                                (replier &&
                                    (replier.role || (r as any).repliedByRole)) ||
                                "User";

                                return (
                                <div key={r._id} className="pl-2">
                                    <div className="flex items-center gap-2 mb-1">
                                    <Avatar className="w-4 h-4 shrink-0">
                                        <AvatarFallback className="text-[8px]">
                                        {rInfo.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium truncate">
                                        {rInfo.name}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground hidden sm:inline">
                                        • {rRole}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground ml-auto">
                                        {format(new Date(r.createdAt), "MM/dd")}
                                    </span>
                                    </div>
                                    <div className="text-xs bg-background border p-2 rounded shadow-sm break-words">
                                    {r.message}
                                    </div>
                                </div>
                                );
                            })}
                            </div>
                        )}

                        {/* Reply Controls */}
                        <div className="mt-1">
                            {replyingTo === c._id ? (
                                <div className="flex gap-2 mt-2 animate-in fade-in zoom-in-95">
                                <Input
                                    className="h-7 text-xs"
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && replyText.trim()) {
                                            onReply(replyText.trim(), c._id);
                                            setReplyText("");
                                            setReplyingTo(null);
                                        }
                                    }}
                                />
                                <Button
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => {
                                    if (!replyText.trim()) return;
                                    onReply(replyText.trim(), c._id);
                                    setReplyText("");
                                    setReplyingTo(null);
                                    }}
                                >
                                    Reply
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setReplyingTo(null)}
                                >
                                    Close
                                </Button>
                                </div>
                            ) : (
                                <button
                                    className="text-[10px] text-muted-foreground hover:text-primary font-medium mt-1"
                                    onClick={() => setReplyingTo(c._id)}
                                >
                                    Reply
                                </button>
                            )}
                        </div>
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-muted/5 flex gap-2 shrink-0">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Add a comment...`}
          className="flex-1 text-sm h-9"
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              onAddComment(text.trim());
              setText("");
            }
          }}
        />
        <Button
          size="icon"
          className="h-9 w-9 shrink-0"
          disabled={!text.trim()}
          onClick={() => {
            onAddComment(text.trim());
            setText("");
          }}
        >
          <SendHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

/* -------------------------------
   Main Page
--------------------------------*/
const SingleAttorneyTrainingDocument = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<TrainingDocument | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Load Data
  const loadDocument = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/training/attorney-assigned");
      const found = res.data.documents.find(
        (d: TrainingDocument) => d._id === documentId
      );

      if (found) {
        setDocument(found);
      } else {
        toast.error("Document not found");
        navigate("/documents/attorney-training");
      }
    } catch (err) {
      console.error("Load document error", err);
      toast.error("Failed to load document");
    } finally {
      setLoading(false);
    }
  }, [documentId, navigate]);

  useEffect(() => {
    if (documentId) loadDocument();
  }, [documentId, loadDocument]);

  // 2. Actions
  const downloadFile = async (filePath: string) => {
    try {
      const res = await apiClient.get("/api/training/file-url", {
        params: { filePath },
      });
      window.open(res.data.url, "_blank");
    } catch {
      toast.error("Download failed");
    }
  };

  const handleComment = async (
    type: "file" | "video",
    itemId: string,
    message: string
  ) => {
    if (!document) return;
    try {
      const endpoint =
        type === "file"
          ? `/api/training/comments/${document._id}/file/${itemId}/comment`
          : `/api/training/comments/${document._id}/video/${itemId}/comment`;
      await apiClient.post(endpoint, { message });
      toast.success("Comment posted");
      loadDocument();
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  const handleReply = async (
    type: "file" | "video",
    itemId: string,
    commentId: string,
    message: string
  ) => {
    if (!document) return;
    try {
      const endpoint =
        type === "file"
          ? `/api/training/comments/${document._id}/file/${itemId}/comment/${commentId}/reply`
          : `/api/training/comments/${document._id}/video/${itemId}/comment/${commentId}/reply`;
      await apiClient.post(endpoint, { message });
      toast.success("Reply posted");
      loadDocument();
    } catch (err) {
      toast.error("Failed to post reply");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
            <div className="flex gap-4 items-center">
                <div className="h-10 w-10 bg-muted/20 rounded-full animate-pulse" />
                <div className="h-8 w-48 bg-muted/20 rounded animate-pulse" />
            </div>
            <div className="h-48 w-full bg-muted/20 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-[500px] bg-muted/20 rounded-xl animate-pulse" />
                <div className="h-[500px] bg-muted/20 rounded-xl animate-pulse" />
            </div>
        </div>
      </Layout>
    );
  }

  if (!document) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-muted/5 pb-20">
        {/* Header */}
        <div className="border-b sticky top-0 bg-background/95 backdrop-blur z-20 supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/documents/attorney-training")}
              className="gap-2 shrink-0 hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
            </Button>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <h1 className="font-semibold text-sm md:text-lg truncate flex-1">
              {document.documentName}
            </h1>

            {/* Assigned Paralegals Section - Responsive */}
            <div className="ml-auto flex items-center gap-2 md:gap-4 shrink-0">
              {document.assignedParalegals &&
              document.assignedParalegals.length > 0 ? (
                <div className="flex items-center gap-2 bg-muted/20 p-1.5 rounded-full md:rounded-lg md:px-3 border border-transparent md:border-border/40">
                  <span className="text-xs text-muted-foreground hidden md:inline mr-1">
                    Team:
                  </span>
                  <div className="flex -space-x-2">
                    {document.assignedParalegals.slice(0, 3).map((p, i) => {
                      const { initials, name } = getDisplayName(p);
                      return (
                        <div key={p._id || i} title={name}>
                          <Avatar className="w-6 h-6 md:w-7 md:h-7 border-2 border-background ring-1 ring-border/20">
                            <AvatarFallback className="text-[9px] bg-secondary text-secondary-foreground font-medium">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      );
                    })}
                    {document.assignedParalegals.length > 3 && (
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium z-10">
                            +{document.assignedParalegals.length - 3}
                        </div>
                    )}
                  </div>
                </div>
              ) : (
                <Badge variant="outline" className="text-muted-foreground gap-1">
                   <Users className="w-3 h-3" /> <span className="hidden sm:inline">Unassigned</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
          {/* Document Details Card */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
              <div className="flex-1 space-y-4">
                 <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                    <Badge variant="outline" className="gap-1.5 font-normal py-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(document.createdAt), "MMM dd, yyyy")}
                    </Badge>
                    <Badge variant="outline" className="gap-1.5 font-normal py-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {document.documentType}
                    </Badge>
                    <Badge
                        variant={
                        document.priority === "High"
                            ? "destructive"
                            : document.priority === "Medium"
                            ? "default"
                            : "secondary"
                        }
                        className="py-1"
                    >
                        {document.priority} Priority
                    </Badge>
                 </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight hidden lg:block">{document.documentName}</h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-4xl">
                  {document.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* FILES SECTION */}
          {document.files && document.files.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold tracking-tight">Documents</h2>
                  <p className="text-muted-foreground text-sm hidden sm:block">
                    Monitor reading progress and answer team questions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                {document.files.map((file) => (
                  // Height Strategy: Auto on Mobile, Fixed 850px on Desktop to keep grid uniform
                  <div
                    key={file._id}
                    className="group relative flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden h-auto lg:h-[850px]"
                  >
                    <div className="p-4 border-b bg-muted/5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0 dark:bg-blue-900/20 dark:border-blue-800">
                          <File className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm truncate max-w-[150px] md:max-w-[250px]" title={file.originalFileName}>
                          {file.originalFileName}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadFile(file.filePath || "")}
                        className="shrink-0 gap-2"
                      >
                        <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>

                    <div className="flex-1 flex flex-col p-4 md:p-5 gap-6 overflow-hidden">
                      {/* Progress Section - Limited Height on Desktop, Auto on Mobile */}
                      <div className="space-y-3 shrink-0">
                        <div className="flex items-center justify-between">
                             <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Users className="w-3 h-3" /> Paralegal Progress
                            </h4>
                        </div>
                        
                        <div className="max-h-[200px] lg:max-h-[240px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                          {file.progress && file.progress.length > 0 ? (
                            file.progress.map((p) => (
                              <ProgressMonitor
                                key={p._id}
                                type="read"
                                value={p.percentageRead ?? 0}
                                lastUpdated={p.lastUpdated}
                                user={p.paralegalId}
                              />
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg bg-muted/5">
                                <span className="text-xs text-muted-foreground italic">No progress recorded yet.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="shrink-0" />

                      {/* Comments Section - Grows to fill remaining space */}
                      <div className="flex-1 min-h-[350px] lg:min-h-0 flex flex-col">
                        <CommentSection
                          type="file"
                          comments={file.comments || []}
                          onAddComment={(txt) =>
                            handleComment("file", file._id, txt)
                          }
                          onReply={(txt, cId) =>
                            handleReply("file", file._id, cId, txt)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VIDEOS SECTION */}
          {document.videos && document.videos.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg dark:bg-orange-900/30 dark:text-orange-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold tracking-tight">Training Videos</h2>
                  <p className="text-muted-foreground text-sm hidden sm:block">
                    Track watch time and facilitate discussions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                {document.videos.map((video) => (
                  <div
                    key={video._id}
                    className="group relative flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden h-auto lg:h-[850px]"
                  >
                    <div className="p-4 border-b bg-muted/5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shrink-0 dark:bg-orange-900/20 dark:border-orange-800">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm truncate max-w-[150px] md:max-w-[250px]" title={video.originalFileName}>
                          {video.originalFileName || "External Link"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          video.isUrl
                            ? window.open(video.url)
                            : downloadFile(video.filePath || "")
                        }
                        className="shrink-0 gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{video.isUrl ? "Open Link" : "Watch"}</span>
                      </Button>
                    </div>

                    <div className="flex-1 flex flex-col p-4 md:p-5 gap-6 overflow-hidden">
                      {/* Progress Section */}
                      <div className="space-y-3 shrink-0">
                         <div className="flex items-center justify-between">
                             <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Users className="w-3 h-3" /> Paralegal Progress
                            </h4>
                        </div>
                        <div className="max-h-[200px] lg:max-h-[240px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                          {video.progress && video.progress.length > 0 ? (
                            video.progress.map((p) => (
                              <ProgressMonitor
                                key={p._id}
                                type="watch"
                                value={p.percentageWatched ?? 0}
                                lastUpdated={p.lastUpdated}
                                user={p.paralegalId}
                              />
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg bg-muted/5">
                                <span className="text-xs text-muted-foreground italic">No progress recorded yet.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="shrink-0" />

                      {/* Comments Section */}
                      <div className="flex-1 min-h-[350px] lg:min-h-0 flex flex-col">
                        <CommentSection
                          type="video"
                          comments={video.comments || []}
                          onAddComment={(txt) =>
                            handleComment("video", video._id, txt)
                          }
                          onReply={(txt, cId) =>
                            handleReply("video", video._id, cId, txt)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SingleAttorneyTrainingDocument;