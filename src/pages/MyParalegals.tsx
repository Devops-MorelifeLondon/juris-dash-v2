"use client";

import { useEffect, useState } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Users,
  Search,
  UserPlus,
  Award,
  MessageSquare,
  Briefcase,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api/config";

// --- Constants ---
const allDomains = [
  "All",
  "Litigation",
  "Real Estate",
  "Corporate",
  "Family Law",
  "Personal Injury",
  "M&A",
  "Contracts",
  "Intellectual Property",
  "Bankruptcy",
];

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

// --- Main Component ---
export default function ParalegalDashboardRedesign() {
  const [assignedParalegals, setAssignedParalegals] = useState([]);
  const [availableParalegals, setAvailableParalegals] = useState([]);
  const [activeDomain, setActiveDomain] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedParalegal, setSelectedParalegal] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Dashboard Info
  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/api/paralegals/dashboard/info");

        if (data.success) {
          const normalize = (arr) =>
            (arr || []).map((p) => ({
              id: p.id || p._id,
              name:
                p.name ||
                `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                "Unnamed Paralegal",
              avatar: p.avatar || "/avatars/default.png",
              expertise: p.expertise || p.practiceAreas || [],
              training: p.training || p.specializations || [],
              availability: p.availability || "Available Soon",
              tasks: (p.tasks || []).map((t) => ({
                id: t.id || t._id,
                title: t.title || "Untitled Task",
                description: t.description || "",
                priority: t.priority || "Medium",
                progress: t.progress || 0,
                comments: (t.comments || []).map((c, i) => ({
                  id: c.id || `c-${i}`,
                  author: c.author || "User",
                  avatar: c.avatar || "/avatars/default.png",
                  text: c.text || "",
                })),
              })),
            }));

          setAssignedParalegals(normalize(data.assignedParalegals));
          setAvailableParalegals(normalize(data.availableParalegals));
        } else {
          console.error("Dashboard info fetch failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardInfo();
  }, []);

  // ✅ Handlers
  const openAssignModal = (paralegal) => {
    setSelectedParalegal(paralegal);
    setIsAssignModalOpen(true);
  };

  const openDetailsModal = (task, paralegal) => {
    setSelectedTask({ ...task, paralegalId: paralegal.id || paralegal._id });
    setIsDetailsModalOpen(true);
  };

  const handleAssignTask = () => {
    if (!newTask.title || !selectedParalegal) return;
    const newAssignedParalegal = {
      ...selectedParalegal,
      tasks: [
        { ...newTask, progress: 0, id: `task-${Date.now()}`, comments: [] },
      ],
    };
    setAssignedParalegals([...assignedParalegals, newAssignedParalegal]);
    setAvailableParalegals(
      availableParalegals.filter((p) => p.id !== selectedParalegal.id)
    );
    setIsAssignModalOpen(false);
    setNewTask({ title: "", description: "", priority: "Medium" });
    setSelectedParalegal(null);
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !selectedTask) return;

    const newCommentObj = {
      id: Date.now(),
      author: "You (Attorney)",
      avatar: "/avatars/attorney.png",
      text: newComment,
    };

    const updatedAssignedParalegals = assignedParalegals.map((p) => {
      if (p.id === selectedTask.paralegalId) {
        const updatedTasks = (p.tasks || []).map((t) => {
          if (t.id === selectedTask.id) {
            return { ...t, comments: [...(t.comments || []), newCommentObj] };
          }
          return t;
        });
        return { ...p, tasks: updatedTasks };
      }
      return p;
    });

    setAssignedParalegals(updatedAssignedParalegals);
    setSelectedTask((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newCommentObj],
    }));
    setNewComment("");
  };

  // ✅ Filters & Derived State
  const filteredAvailable = (availableParalegals || [])
    .filter(
      (p) =>
        activeDomain === "All" || (p.expertise || []).includes(activeDomain)
    )
    .filter((p) =>
      (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalActiveTasks = assignedParalegals.reduce(
    (acc, p) => acc + (p.tasks?.length || 0),
    0
  );
  const assignedCount = assignedParalegals.length;
  const availableCount = availableParalegals.length;

  // ✅ Loading State
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh] text-gray-500 text-sm">
          Loading your dashboard...
        </div>
      </Layout>
    );
  }

  // ✅ Main Render
  return (
    <Layout>
      <div className="w-full bg-gray-50/50 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* --- Header & Stats --- */}
          <header>
          
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Tasks
                  </CardTitle>
                  <Briefcase className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalActiveTasks}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tasks currently in progress
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    My Team
                  </CardTitle>
                  <Users className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{assignedCount}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Paralegals assigned to your cases
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Available Experts
                  </CardTitle>
                  <UserCheck className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{availableCount}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Ready to be assigned
                  </p>
                </CardContent>
              </Card>
            </div>
          </header>

          {/* --- Main Content Grid --- */}
          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* --- Left Column: My Team's Workload --- */}
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-4">
                  My Team's Workload
                </h2>

                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    {assignedParalegals.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {assignedParalegals.map((p) => (
                          <AccordionItem value={p.id} key={p.id}>
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                              <div className="flex items-center gap-4 w-full">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={p.avatar} alt={p.name} />
                                  <AvatarFallback>
                                    {p.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left">
                                  <div className="font-semibold text-blue-900">
                                    {p.name}
                                  </div>
                                  <div className="flex flex-wrap gap-1 pt-1.5">
                                    {(p.expertise || [])
                                      .slice(0, 3)
                                      .map((d, i) => (
                                        <Badge
                                          key={i}
                                          variant="outline"
                                          className="text-blue-700 bg-blue-50 border-blue-200 text-xs"
                                        >
                                          {d}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500 pr-2">
                                  {p.tasks?.length || 0} Active Task
                                  {p.tasks?.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 bg-gray-50/70 border-t">
                              <h4 className="font-semibold text-gray-700 mb-3 text-sm pt-4">
                                Current Tasks
                              </h4>
                              <div className="space-y-4">
                                {(p.tasks || []).map((task) => (
                                  <div key={task.id} className="group">
                                    <button
                                      onClick={() => openDetailsModal(task, p)}
                                      className="w-full text-left p-3 rounded-lg bg-white shadow-sm border border-gray-200 hover:border-blue-400 transition-colors"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <p className="flex items-center text-sm font-medium text-gray-900">
                                          <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
                                          {task.title}
                                        </p>
                                        <Badge
                                          className={`text-xs ${getPriorityColor(
                                            task.priority
                                          )}`}
                                        >
                                          {task.priority}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Progress
                                          value={task.progress}
                                          className="w-full h-2"
                                        />
                                        <span className="text-sm font-bold text-blue-700">
                                          {task.progress}%
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-16 px-6">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                          No Paralegals Assigned
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Assign a paralegal from the "Find an Expert" list to
                          get started.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* --- Right Column: Find an Expert --- */}
            <div className="lg:col-span-3 space-y-6">
              <section className="sticky top-8">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Find an Expert
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Select
                        value={activeDomain}
                        onValueChange={setActiveDomain}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Filter by domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {allDomains.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
                      {filteredAvailable.length > 0 ? (
                        filteredAvailable.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={p.avatar} alt={p.name} />
                              <AvatarFallback>
                                {p.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-800">
                                {p.name}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    p.availability?.includes("Available")
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                  }`}
                                ></span>
                                <span className="text-xs text-gray-600">
                                  {p.availability}
                                </span>
                              </div>
                            </div>
                            {/* <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => openAssignModal(p)}
                            >
                              <UserPlus className="w-4 h-4 mr-1.5" />
                              Assign
                            </Button> */}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-sm text-gray-500">
                          <p>No paralegals match your criteria.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* --- Assign Task Modal --- */}
      <Dialog
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Task to {selectedParalegal?.name}
            </DialogTitle>
            <DialogDescription>
              Fill out the details for the new task. This will move{" "}
              {selectedParalegal?.name} to your "My Team" list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignTask}>Assign Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Task Details Modal --- */}
      <Dialog
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedTask?.title}</DialogTitle>
            <DialogDescription className="pt-2">
              {selectedTask?.description || "No description provided."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600">Progress</span>
                <span className="font-bold text-blue-600">
                  {selectedTask?.progress}%
                </span>
              </div>
              <Progress value={selectedTask?.progress} className="h-2" />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Comments</h4>
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                {(selectedTask?.comments || []).length > 0 ? (
                  selectedTask.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>
                          {comment.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                        <p className="font-semibold text-sm text-gray-900">
                          {comment.author}
                        </p>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No comments on this task yet.
                  </p>
                )}
              </div>
              
              {/* Post New Comment */}
              <div className="space-y-2">
                <Label htmlFor="new-comment">Add a comment</Label>
                <Textarea
                  id="new-comment"
                  placeholder="Write your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Close
            </Button>
            <Button onClick={handlePostComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}