import { Layout } from "@/components/ui/layout";

import { ActiveCases } from "@/components/dashboard/ActiveCases";
import { ParalegalStatus } from "@/components/dashboard/ParalegalStatus";
import { Calendar, Clock, FileText, TrendingUp, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LegalDashboard } from "@/components/dashboard/DashboardStats";
import { useSelector } from "react-redux";
import { TaskStats } from "@/components/dashboard/TaskStats";

import { RootState } from "../store/store";



const Index = () => {
  const attorney = useSelector((state: RootState) => state.attorney);
  console.log(attorney);
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
                  Welcome back,{attorney.fullName}
                </h1>
                <p className="text-primary-foreground/90 text-lg animate-fade-in" style={{ animationDelay: "100ms" }}>
                  Your legal practice dashboard - AI-powered paralegal workforce at your fingertips
                </p>
                <div className="flex items-center gap-4 mt-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
                    <Zap className="h-3 w-3 mr-1" />
                    18 Paralegals Active
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    89% Task Completion
                  </Badge>
                </div>
              </div>
              
              <div className="hidden lg:block animate-fade-in" style={{ animationDelay: "300ms" }}>
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users className="h-16 w-16 text-primary-foreground/80" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <Button onClick={()=> window.location.href="/tasks"} variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                <FileText className="h-4 w-4 mr-2" />
                Assign New Task
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-primary hover:bg-white/10">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <LegalDashboard />
         {/* ✅ ADD Task Statistics */}
        <TaskStats />

        {/* Main Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Cases */}
          <div className="col-span-2 space-y-6">
            <ActiveCases />
            
            {/* Quick Insights */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Today's Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Draft Reviews</span>
                    <Badge variant="outline">3 pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Client Meetings</span>
                    <Badge variant="outline">2 scheduled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deadlines</span>
                    <Badge variant="outline" className="border-warning/20 text-warning">5 this week</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">SOP Compliance</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AI Accuracy</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Paralegal Status */}
          <div className="lg:col-span-2 space-y-6">
            <ParalegalStatus />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
