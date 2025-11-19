"use client";

import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Layout } from "@/components/ui/layout";
import { apiClient } from "@/lib/api/config";
import {
  CheckCircle,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
  Clock,
  Calendar,
} from "lucide-react";

export default function MeetingDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const [selectedParalegal, setSelectedParalegal] = useState<any>(null);
  const [paralegals, setParalegals] = useState<any[]>([]);
  const [meetLink, setMeetLink] = useState("");
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  const [ongoingMeetings, setOngoingMeetings] = useState<any[]>([]);
  const [pastMeetings, setPastMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  // Fetch paralegals
  const fetchParalegals = async () => {
    try {
      const res = await apiClient.get("/api/paralegals");
      setParalegals(res.data.data || []);
    } catch (err) {
      console.error("Error fetching paralegals:", err);
    }
  };

  // Fetch all meetings
  const fetchMeetings = async () => {
    try {
      const res = await apiClient.get("/api/meetings/all");
      setUpcomingMeetings(res.data.upcoming || []);
      setOngoingMeetings(res.data.ongoing || []);
      setPastMeetings(res.data.past || []);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    }
  };

  // Check Google connection
  const checkGoogleConnection = async () => {
    try {
      const res = await apiClient.get("/api/google/status");
      setGoogleConnected(res.data.connected);
    } catch (err) {
      console.error("Error checking Google status:", err);
    }
  };

  useEffect(() => {
    fetchParalegals();
    fetchMeetings();
    checkGoogleConnection();
  }, []);

  // Schedule Meeting
 // Schedule Meeting
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedParalegal) return alert("Please select a paralegal");
    if (!googleConnected)
      return alert("Please connect your Google Calendar first");

    setLoading(true);
    try {
      const res = await apiClient.post("/api/schedule", {
        ...form,
        participantId: selectedParalegal._id,
        participantEmail: selectedParalegal.email,
      });

      setMeetLink(res.data.meetLink);
      fetchMeetings();
      setForm({ title: "", description: "", startTime: "", endTime: "" });
      setSelectedParalegal(null);
    } catch (err: any) {
      console.error("Schedule error:", err);
      
      const errorMessage = err.response?.data?.error || "Failed to schedule meeting";
      alert(errorMessage);

      // ⚠️ FIX: If the error is related to Google Auth, reset the UI state
      if (err.response?.status === 401 && errorMessage.includes("Google")) {
        setGoogleConnected(false); // This brings back the "Connect Google Calendar" button
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl shadow-xl border border-slate-200 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Meetings Dashboard
          </h1>

          {googleConnected ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Google Connected</span>
            </div>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={async () => {
                try {
                  const res = await apiClient.get("/api/google/auth");
                  if (res.data.url) {
                    window.location.href = res.data.url;
                  } else {
                    alert("Failed to get Google URL");
                  }
                } catch (err) {
                  console.error("Google connect error:", err);
                  alert("Unable to initiate Google connection");
                }
              }}
            >
              <LinkIcon className="w-4 h-4" />
              Connect Google Calendar
            </Button>
          )}
        </div>

        {/* Meeting Form */}
        <Card className="shadow-md border border-slate-200 bg-white/70 backdrop-blur-xl rounded-2xl transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700">
              🗓️ Schedule a New Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div>
                <Label className="text-slate-600 font-medium">Title</Label>
                <Input
                  className="mt-1 border-slate-300 focus:ring-blue-400"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Meeting title"
                  required
                />
              </div>

              <div>
                <Label className="text-slate-600 font-medium">Description</Label>
                <Textarea
                  className="mt-1 border-slate-300 focus:ring-blue-400"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Add meeting details..."
                />
              </div>

              <div>
                <Label className="text-slate-600 font-medium">
                  Select Paralegal
                </Label>
                <Select
                  value={selectedParalegal?._id || ""}
                  onValueChange={(id) => {
                    const found = paralegals.find((p) => p._id === id);
                    setSelectedParalegal(found);
                  }}
                >
                  <SelectTrigger className="border-slate-300 focus:ring-blue-400">
                    <SelectValue placeholder="Choose a paralegal" />
                  </SelectTrigger>
                  <SelectContent>
                    {paralegals.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.firstName} {p.lastName} ({p.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600 font-medium">Start Time</Label>
                  <Input
                    type="datetime-local"
                    className="mt-1 border-slate-300 focus:ring-blue-400"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-600 font-medium">End Time</Label>
                  <Input
                    type="datetime-local"
                    className="mt-1 border-slate-300 focus:ring-blue-400"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md"
                disabled={loading || !googleConnected}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Creating...
                  </span>
                ) : (
                  "Create Meeting"
                )}
              </Button>

              {meetLink && (
                <p className="text-green-600 mt-3">
                  ✅ Meeting created:{" "}
                  <a
                    href={meetLink}
                    className="underline text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {meetLink}
                  </a>
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Ongoing Meetings */}
        <MeetingSection
          title="🟢 Ongoing Meetings"
          color="green"
          meetings={ongoingMeetings}
        />

        {/* Upcoming Meetings */}
        <MeetingSection
          title="📅 Upcoming Meetings"
          color="blue"
          meetings={upcomingMeetings}
        />

        {/* Past Meetings */}
        <MeetingSection
          title="⏳ Past Meetings"
          color="gray"
          meetings={pastMeetings}
        />
      </div>
    </Layout>
  );
}

const MeetingSection = ({
  title,
  color,
  meetings,
}: {
  title: string;
  color: string;
  meetings: any[];
}) => (
  <Card
    className={`shadow-md border border-${color}-200 bg-white/70 backdrop-blur-xl rounded-2xl transition-all hover:shadow-lg`}
  >
    <CardHeader>
      <CardTitle
        className={`text-xl font-semibold text-${color}-700 flex items-center gap-2`}
      >
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {meetings.length === 0 ? (
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>No meetings found.</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {meetings.map((m) => (
            <Card
              key={m._id}
              className={`border border-${color}-300 rounded-2xl shadow-sm hover:shadow-md transition`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-slate-700">
                  {m.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-500">
                  {m.description || "No description"}
                </p>

                {/* Scheduled By */}
                {m.createdBy && (
                  <p className="text-xs text-slate-600">
                    <strong>Scheduled by:</strong>{" "}
                    {m.createdBy.fullName || m.createdBy.firstName +" "+m.createdBy.lastName || "Unknown"}{" "}
                    <span className="text-slate-400">
                      ({m.createdBy.email || "N/A"})
                    </span>
                  </p>
                )}

                {/* Participants */}
                {m.participants?.length > 0 && (
                  <p className="text-xs text-slate-600">
                    <strong>Participants:</strong>{" "}
                    {m.participants
                      .map(
                        (p: any) =>
                          `${p.fullName || p.firstName +" "+p.lastName || "Unknown"} (${p.email || "N/A"})`
                      )
                      .join(", ")}
                  </p>
                )}

                {/* Time Details */}
                <div className="pt-1 text-xs text-slate-500">
                  <p>
                    <strong>Start:</strong>{" "}
                    {format(new Date(m.startTime), "PPpp")}
                  </p>
                  <p>
                    <strong>End:</strong> {format(new Date(m.endTime), "PPpp")}
                  </p>
                  <p className="text-slate-400 mt-1 italic">
                    {formatDistanceToNow(new Date(m.endTime), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {/* Meet Link */}
                {m.meetLink && (
                  <a
                    href={m.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-${color}-600 underline mt-2 inline-block`}
                  >
                    Join Meeting
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
