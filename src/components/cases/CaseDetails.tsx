import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Edit2, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  MessageSquare,
  DollarSign,
  Calendar,
  User,
  Bot,
  Download,
  Eye,
  Send,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Case, Task, Communication } from "./types";

interface CaseDetailsProps {
  caseData: Case;
  onEdit: () => void;
  onUpdateCase: (updatedCase: Case) => void;
}

export default function CaseDetails({ caseData, onEdit, onUpdateCase }: CaseDetailsProps) {
  const [newMessage, setNewMessage] = useState("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-500";
      case "In Progress": return "bg-yellow-500";
      case "Review": return "bg-purple-500";
      case "Closed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const completedTasks = caseData.tasks.filter(t => t.completed).length;
  const taskCompletionRate = caseData.tasks.length > 0 ? (completedTasks / caseData.tasks.length) * 100 : 0;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newCommunication: Communication = {
      id: `msg-${Date.now()}`,
      from: "Attorney",
      to: caseData.paralegal,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "Internal"
    };

    const updatedCase = {
      ...caseData,
      communications: [newCommunication, ...caseData.communications],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onUpdateCase(updatedCase);
    setNewMessage("");
  };

  return (
    <div className="space-y-4 sm:space-y-6 h-full overflow-y-auto p-3 sm:p-4 lg:p-6">
      {/* Header Card - Mobile optimized */}
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight line-clamp-2">
                    {caseData.name}
                  </CardTitle>
                  {isOverdue(caseData.deadline) && (
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                </div>
                <CardDescription className="text-base sm:text-lg font-medium">
                  {caseData.client}
                </CardDescription>
              </div>
              
              <Button 
                variant="outline" 
                onClick={onEdit}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Case
              </Button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                className={`${getStatusColor(caseData.status)} text-white text-xs sm:text-sm px-2 py-1`}
              >
                {caseData.status}
              </Badge>
              <Badge 
                className={`${getPriorityColor(caseData.priority)} text-white text-xs sm:text-sm px-2 py-1`}
              >
                {caseData.priority}
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">
                {caseData.serviceType}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Key Info Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg sm:bg-transparent sm:p-0">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Paralegal</p>
                <p className="font-medium text-sm sm:text-base truncate">{caseData.paralegal}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg sm:bg-transparent sm:p-0">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Deadline</p>
                <p className={`font-medium text-sm sm:text-base ${isOverdue(caseData.deadline) ? 'text-red-600' : ''}`}>
                  {new Date(caseData.deadline).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg sm:bg-transparent sm:p-0">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Time Logged</p>
                <p className="font-medium text-sm sm:text-base">{caseData.timeSpent}h</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg sm:bg-transparent sm:p-0">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Budget</p>
                <p className="font-medium text-sm sm:text-base">
                  ${caseData.budget?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {caseData.notes && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">Case Notes</p>
              <p className="text-sm sm:text-base leading-relaxed">{caseData.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs - Mobile optimized */}
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="documents" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
            <TabsTrigger value="documents" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Documents</span>
              <span className="sm:hidden">Docs</span>
              <span className="ml-1">({caseData.documents.length})</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Tasks</span>
              <span className="sm:hidden">Tasks</span>
              <span className="ml-1">({caseData.tasks.length})</span>
            </TabsTrigger>
            <TabsTrigger value="communications" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">Msgs</span>
              <span className="ml-1">({caseData.communications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="flex-1 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  Documents & Drafts
                </CardTitle>
              </CardHeader>
             <CardContent className="p-0">
  {caseData.documents.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">No documents yet</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Upload your first document to get started with case management
      </p>
    </div>
  ) : (
    <div className="divide-y divide-border">
      {caseData.documents.map((doc, index) => (
        <div key={doc.id} className="group hover:bg-muted/30 transition-colors duration-200">
          <div className="p-4 sm:p-6">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{doc.paralegalName}</span>
                    <span>•</span>
                    <time>{new Date(doc.uploadDate).toLocaleDateString()}</time>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Desktop */}
              <div className="hidden sm:flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 px-3">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 px-3">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status and Badges Section */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className="text-xs font-medium">
                {doc.type}
              </Badge>
              
              {doc.revisionCount > 1 && (
                <Badge variant="secondary" className="text-xs">
                  Version {doc.revisionCount}
                </Badge>
              )}

              {/* Compliance Status */}
              <div className="flex items-center gap-1.5">
                {doc.sopCompliant ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Compliant
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs font-medium text-red-700 dark:text-red-400">
                      Non-Compliant
                    </span>
                  </>
                )}
              </div>

              {/* Status Badge */}
              <Badge 
                variant={
                  doc.status === "Approved" ? "default" : 
                  doc.status === "Needs Revision" ? "destructive" : 
                  "secondary"
                }
                className="text-xs font-medium ml-auto"
              >
                {doc.status}
              </Badge>
            </div>

            {/* Mobile Actions */}
            <div className="flex sm:hidden gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          {index < caseData.documents.length - 1 && (
            <div className="ml-[2.75rem] h-px bg-gradient-to-r from-border via-border/50 to-transparent"></div>
          )}
        </div>
      ))}
    </div>
  )}
</CardContent>

            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="flex-1 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Tasks & Time Tracking
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {completedTasks}/{caseData.tasks.length} completed
                  </div>
                </div>
                <Progress value={taskCompletionRate} className="mt-3" />
              </CardHeader>
              <CardContent>
                {caseData.tasks.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">No tasks assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {caseData.tasks.map(task => (
                      <div key={task.id} className={`p-3 sm:p-4 border rounded-lg ${task.completed ? 'bg-green-50 border-green-200' : 'bg-background'}`}>
                        <div className="space-y-3">
                          {/* Task Header */}
                          <div className="flex items-start gap-3">
                            {task.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Clock className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm sm:text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>

                          {/* Task Details */}
                          <div className="ml-8 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
                              <span>Type: <span className="font-medium">{task.type}</span></span>
                              <span>Assigned: <span className="font-medium">{task.paralegalAssigned}</span></span>
                              <span>Time: <span className="font-medium">{Math.floor(task.timeSpentMinutes / 60)}h {task.timeSpentMinutes % 60}m</span></span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              {task.aiAssisted && (
                                <Badge variant="outline" className="text-xs">
                                  <Bot className="h-3 w-3 mr-1" />
                                  AI Assisted
                                </Badge>
                              )}
                              {task.dueDate && (
                                <span className="text-xs text-muted-foreground">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="flex-1 space-y-4">
            <Card className="flex flex-col h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  Communications
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                {/* Message Input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px] sm:min-h-[60px] resize-none"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    className="w-full sm:w-auto sm:h-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
                  {caseData.communications.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">No messages yet</p>
                    </div>
                  ) : (
                    caseData.communications.map(comm => (
                      <div key={comm.id} className="p-3 sm:p-4 border rounded-lg bg-background">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-sm">{comm.from}</p>
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{comm.to}</span>
                            <Badge variant="outline" className="text-xs">{comm.type}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comm.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed">{comm.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="flex-1 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Time Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {['Drafting', 'Research', 'Review', 'Communication'].map(type => {
                      const typeTime = caseData.tasks
                        .filter(t => t.type === type)
                        .reduce((acc, t) => acc + t.timeSpentMinutes, 0);
                      const totalTime = caseData.tasks.reduce((acc, t) => acc + t.timeSpentMinutes, 0);
                      const percentage = totalTime > 0 ? (typeTime / totalTime) * 100 : 0;
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">{type}</span>
                            <div className="text-right">
                              <div className="font-medium">
                                {Math.floor(typeTime / 60)}h {typeTime % 60}m
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {percentage.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Case Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tasks Completed</span>
                        <span className="font-medium">{completedTasks}/{caseData.tasks.length}</span>
                      </div>
                      <Progress value={taskCompletionRate} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground mb-1">Created</p>
                        <p className="font-medium">{new Date(caseData.createdDate).toLocaleDateString()}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground mb-1">Last Updated</p>
                        <p className="font-medium">{new Date(caseData.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm mb-2 font-medium">SOP Compliance</p>
                      <div className="flex items-center gap-3">
                        {caseData.documents.length > 0 ? (
                          <>
                            <Progress 
                              value={(caseData.documents.filter(d => d.sopCompliant).length / caseData.documents.length) * 100} 
                              className="flex-1"
                            />
                            <span className="text-sm font-medium min-w-0">
                              {Math.round((caseData.documents.filter(d => d.sopCompliant).length / caseData.documents.length) * 100)}%
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">No documents to analyze</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
