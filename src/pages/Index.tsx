import { Layout } from "@/components/ui/layout";
import { ActiveCases } from "@/components/dashboard/ActiveCases";
import { ParalegalStatus } from "@/components/dashboard/ParalegalStatus";
import { FileText, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalDashboard } from "@/components/dashboard/DashboardStats";
import { TaskStats } from "@/components/dashboard/TaskStats";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Index = () => {
  const attorney = useSelector((state: RootState) => state.attorney);

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold animate-fade-in">
                  Welcome back, {attorney?.fullName || "Attorney"}
                </h1>
                <p
                  className="text-primary-foreground/90 text-lg animate-fade-in"
                  style={{ animationDelay: "100ms" }}
                >
                  Your AI-powered legal dashboard — manage cases, tasks, and team efficiently.
                </p>
              </div>

              <div
                className="hidden lg:block animate-fade-in"
                style={{ animationDelay: "300ms" }}
              >
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users className="h-16 w-16 text-primary-foreground/80" />
                </div>
              </div>
            </div>

            <div
              className="flex gap-3 mt-6 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <Button
                onClick={() => (window.location.href = "/tasks")}
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <FileText className="h-4 w-4 mr-2" />
                Assign New Task
              </Button>

              <Button
                onClick={() => (window.location.href = "/meetings")}
                variant="outline"
                size="lg"
                className="border-white/30 text-primary hover:bg-white/10"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <LegalDashboard />

        {/* Task Statistics */}
        <TaskStats />

        {/* Active Cases & Paralegal Status */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="col-span-2 space-y-6">
            <ActiveCases />
          </div>

          
        </div>
      </div>
    </Layout>
  );
};

export default Index;
