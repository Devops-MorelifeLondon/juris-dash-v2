"use client";

import { useState } from "react";
import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Briefcase,
  Scale,
  Home,
  UserPlus,
  Filter,
  Search,
  X,
  PlusCircle,
  MessageSquare,
  Award,
  Send,
} from "lucide-react";

// --- MOCK DATA ---
const initialAssignedParalegals = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/avatars/01.png",
    expertise: ["Litigation", "Family Law"],
    training: ["Federal Litigation", "NY State Law", "Bluebook Citation"],
    tasks: [
      {
        id: "task-101",
        title: "Case Briefing #124",
        description: "Review and summarize the latest discovery documents for case #124. Focus on key evidence and potential motions.",
        progress: 80,
        priority: "High",
        comments: [
            { id: 1, author: "John Doe (Attorney)", avatar: "/avatars/attorney.png", text: "Great progress, Alice. Please also cross-reference with the plaintiff's latest deposition." },
            { id: 2, author: "Alice Johnson", avatar: "/avatars/01.png", text: "Will do, John. I'll have the updated summary by EOD." },
        ]
      },
      {
        id: "task-102",
        title: "Smith v. Jones Document Review",
        description: "Analyze all client communications related to the Smith v. Jones case and flag for attorney review.",
        progress: 45,
        priority: "Medium",
        comments: []
      },
    ],
  },
];

const initialAvailableParalegals = [
  { id: 3, name: "Brenda Smith", avatar: "/avatars/03.png", expertise: ["Corporate", "M&A"], training: ["SEC Filings", "Due Diligence"], availability: "Available" },
  { id: 4, name: "David Rodriguez", avatar: "/avatars/04.png", expertise: ["Litigation", "Personal Injury"], training: ["Federal Litigation", "Medical Record Analysis"], availability: "Available" },
  { id: 5, name: "Emily White", avatar: "/avatars/05.png", expertise: ["Real Estate", "Contracts"], training: ["Title Searches", "Contract Law"], availability: "Partially Available" },
  { id: 6, name: "Charles Brown", avatar: "/avatars/06.png", expertise: ["Family Law"], training: ["NY State Law", "Mediation"], availability: "Available" },
];

const allDomains = ["All", "Litigation", "Real Estate", "Corporate", "Family Law", "Personal Injury", "M&A", "Contracts"];

// --- MAIN COMPONENT ---
export default function ParalegalDashboard() {
  const [assignedParalegals, setAssignedParalegals] = useState(initialAssignedParalegals);
  const [availableParalegals, setAvailableParalegals] = useState(initialAvailableParalegals);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedParalegal, setSelectedParalegal] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium" });
  const [newComment, setNewComment] = useState("");


  const openAssignModal = (paralegal) => {
    setSelectedParalegal(paralegal);
    setIsAssignModalOpen(true);
  };

  const openDetailsModal = (task, paralegal) => {
    setSelectedTask({ ...task, paralegalId: paralegal.id });
    setIsDetailsModalOpen(true);
  };
  
  const handleAssignTask = () => {
    if (!newTask.title || !selectedParalegal) return;

    const newAssignedParalegal = {
      ...selectedParalegal,
      tasks: [{ ...newTask, progress: 0, id: `task-${Date.now()}`, comments: [] }],
    };

    setAssignedParalegals([...assignedParalegals, newAssignedParalegal]);
    setAvailableParalegals(availableParalegals.filter(p => p.id !== selectedParalegal.id));
    
    // Reset and close modal
    setIsAssignModalOpen(false);
    setNewTask({ title: "", description: "", priority: "Medium" });
    setSelectedParalegal(null);
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !selectedTask) return;

    const newCommentObj = {
        id: Date.now(),
        author: "You (Attorney)", // Placeholder for current user
        avatar: "/avatars/attorney.png",
        text: newComment,
    };
    
    const updatedAssignedParalegals = assignedParalegals.map(p => {
        if (p.id === selectedTask.paralegalId) {
            const updatedTasks = p.tasks.map(t => {
                if (t.id === selectedTask.id) {
                    return { ...t, comments: [...t.comments, newCommentObj] };
                }
                return t;
            });
            return { ...p, tasks: updatedTasks };
        }
        return p;
    });

    setAssignedParalegals(updatedAssignedParalegals);

    // Also update the selectedTask state to reflect the change immediately in the modal
    setSelectedTask(prev => ({
        ...prev,
        comments: [...prev.comments, newCommentObj]
    }));

    setNewComment("");
  };

  const filteredAvailable = availableParalegals
    .filter(p => activeFilter === "All" || p.expertise.includes(activeFilter))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout>
      <div className="w-full bg-gray-50/50 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
          
          {/* --- SECTION: MY PARALEGALS --- */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">My Paralegals</h2>
              <p className="text-sm text-gray-500 mt-1">Your dedicated team and their active workload.</p>
            </div>
            {assignedParalegals.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {assignedParalegals.map((p) => (
                  <Card key={p.id} className="bg-white border shadow-sm">
                    <CardHeader className="flex flex-row items-start gap-4">
                      <Avatar className="h-12 w-12"><AvatarImage src={p.avatar} alt={p.name} /><AvatarFallback>{p.name.charAt(0)}</AvatarFallback></Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-blue-900">{p.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 pt-2">
                          {p.expertise.map(d => <Badge key={d} variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">{d}</Badge>)}
                        </div>
                         <div className="mt-3">
                            <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                                <Award className="w-3.5 h-3.5 mr-1.5" /> Trained In
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {p.training.map(t => <Badge key={t} className="bg-gray-100 text-gray-700 font-normal">{t}</Badge>)}
                            </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold text-gray-700 mb-3 text-sm">Current Tasks</h4>
                      <div className="space-y-3">
                        {p.tasks.map((task) => (
                          <div key={task.id} className="group">
                            <button onClick={() => openDetailsModal(task, p)} className="w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between items-center mb-1">
                                <p className="flex items-center text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                  <MessageSquare className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-500" />
                                  {task.title}
                                </p>
                                <span className="text-sm font-bold text-blue-700">{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} className="w-full h-1.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-6 bg-white rounded-lg border-2 border-dashed">
                <Users className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Paralegals Assigned</h3>
                <p className="mt-1 text-sm text-gray-500">Assign a paralegal from the list below to get started.</p>
              </div>
            )}
          </section>

          {/* --- SECTION: AVAILABLE PARALEGALS --- */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Available Paralegals</h2>
              <p className="text-sm text-gray-500 mt-1">Find and assign experts based on their domain and availability.</p>
            </div>
            
            {/* Filter & Search Controls */}
            <div className="mb-6 p-3 bg-white rounded-lg border shadow-sm flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                <Filter className="w-5 h-5 text-gray-500" />
                {allDomains.slice(0, 5).map(d => (
                  <Button key={d} variant={activeFilter === d ? "default" : "ghost"} size="sm" onClick={() => setActiveFilter(d)} className={`rounded-md ${activeFilter === d ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-600 hover:bg-blue-50'}`}>{d}</Button>
                ))}
              </div>
              <div className="relative w-full md:max-w-xs ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAvailable.map((p) => (
                <Card key={p.id} className="bg-white border flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                     <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10"><AvatarImage src={p.avatar} alt={p.name} /><AvatarFallback>{p.name.charAt(0)}</AvatarFallback></Avatar>
                        <CardTitle className="text-base text-gray-800">{p.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-3">
                      <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-1.5">{p.expertise.map(d => <Badge key={d} className="bg-gray-100 text-gray-700 font-normal">{d}</Badge>)}</div>
                    </div>
                     <div className="mb-4">
                        <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center"><Award className="w-3.5 h-3.5 mr-1.5" /> Trained In</h4>
                        <div className="flex flex-wrap gap-1.5">{p.training.map(t => <Badge key={t} className="bg-gray-100 text-gray-700 font-normal">{t}</Badge>)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${p.availability === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <span className="text-xs font-medium text-gray-600">{p.availability}</span>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => openAssignModal(p)}><UserPlus className="w-4 h-4 mr-2" />Assign</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* --- MODAL: ASSIGN TASK --- */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Task to {selectedParalegal?.name}</DialogTitle>
            <DialogDescription>Fill out the details below to assign a new task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">Task Title</Label>
              <Input id="task-title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-desc" className="text-right">Description</Label>
               <Textarea id="task-desc" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-priority" className="text-right">Priority</Label>
              <Select onValueChange={(value) => setNewTask({ ...newTask, priority: value })} defaultValue={newTask.priority}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Set priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTask}><PlusCircle className="mr-2 h-4 w-4" />Assign Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* --- MODAL: TASK DETAILS & CHAT --- */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                  <DialogTitle>{selectedTask?.title}</DialogTitle>
                  <DialogDescription>
                      <Badge className={
                          selectedTask?.priority === 'High' ? 'bg-red-100 text-red-800' :
                          selectedTask?.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                      }>{selectedTask?.priority} Priority</Badge>
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm">
                  <p className="text-gray-600">{selectedTask?.description}</p>
                  <div>
                      <Label>Progress</Label>
                      <div className="flex items-center gap-3">
                          <Progress value={selectedTask?.progress} className="w-full" />
                          <span className="font-bold text-blue-700">{selectedTask?.progress}%</span>
                      </div>
                  </div>
                  
                  {/* --- BUILT-IN CHAT & MESSAGING --- */}
                  <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-700 mb-3 text-sm flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" /> Task Discussion
                      </h4>
                      <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                        {selectedTask?.comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.avatar} alt={comment.author} />
                                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="bg-gray-100 rounded-lg px-3 py-2 flex-1">
                                    <p className="font-semibold text-xs text-gray-800">{comment.author}</p>
                                    <p className="text-gray-600">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                         {selectedTask?.comments.length === 0 && (
                            <p className="text-center text-xs text-gray-400 py-4">No comments yet. Start the conversation!</p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                          <Input 
                            placeholder="Type your message..." 
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handlePostComment()}
                          />
                          <Button size="icon" onClick={handlePostComment} disabled={!newComment.trim()}>
                            <Send className="w-4 h-4"/>
                          </Button>
                      </div>
                  </div>
              </div>
              <DialogFooter>
                  <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </Layout>
  );
}
