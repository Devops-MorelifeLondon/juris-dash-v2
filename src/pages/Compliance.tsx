import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Download } from "lucide-react";

const complianceMetrics = [
  { title: "SOP Compliance", value: 94, target: 95, status: "warning" },
  { title: "Task Completion Rate", value: 98, target: 90, status: "success" },
  { title: "Time Tracking Accuracy", value: 96, target: 95, status: "success" },
  { title: "Document Quality Score", value: 89, target: 90, status: "warning" },
];

const escalationItems = [
  {
    id: 1,
    caseName: "Johnson v. Smith Divorce",
    paralegal: "Sarah Chen",
    issue: "Missing client signature verification",
    status: "pending",
    priority: "high",
    dateReported: "2024-01-15",
    estimatedResolution: "2024-01-17"
  },
  {
    id: 2,
    caseName: "ABC Corp Formation",
    paralegal: "Michael Rodriguez",
    issue: "Incomplete state filing documentation",
    status: "in-progress",
    priority: "medium",
    dateReported: "2024-01-14",
    estimatedResolution: "2024-01-16"
  },
  {
    id: 3,
    caseName: "Personal Injury - Wilson",
    paralegal: "Emily Watson",
    issue: "Medical records timestamp discrepancy",
    status: "resolved",
    priority: "low",
    dateReported: "2024-01-13",
    estimatedResolution: "2024-01-15"
  }
];

const reports = [
  { name: "Weekly Compliance Summary", type: "PDF", date: "Jan 15, 2024", size: "2.4 MB" },
  { name: "Paralegal Performance Report", type: "Excel", date: "Jan 15, 2024", size: "1.8 MB" },
  { name: "SOP Deviation Analysis", type: "PDF", date: "Jan 14, 2024", size: "3.2 MB" },
  { name: "Time Tracking Report", type: "CSV", date: "Jan 14, 2024", size: "856 KB" }
];

export default function Compliance() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Compliance & Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor compliance metrics and generate reports
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceMetrics.map((metric, index) => (
            <Card key={index} className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    metric.status === 'success' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    {metric.status === 'success' ? 
                      <CheckCircle className="h-5 w-5 text-success" /> :
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    }
                  </div>
                  <Badge variant={metric.status === 'success' ? 'default' : 'secondary'}>
                    {metric.value}%
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-2">{metric.title}</h3>
                <Progress value={metric.value} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Target: {metric.target}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Recent Alerts
              </CardTitle>
              <CardDescription>AI-detected compliance issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert className="border-warning/20 bg-warning/5">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-sm">
                  <strong>SOP Deviation:</strong> Johnson case missing required client verification step
                </AlertDescription>
              </Alert>
              
              <Alert className="border-info/20 bg-info/5">
                <Clock className="h-4 w-4 text-info" />
                <AlertDescription className="text-sm">
                  <strong>Time Tracking:</strong> 3 entries require supervisor approval
                </AlertDescription>
              </Alert>
              
              <Alert className="border-success/20 bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-sm">
                  <strong>Quality Check:</strong> All documents passed automated review
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription>7-day compliance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Document Quality</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[89%] h-full bg-gradient-primary"></div>
                    </div>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time Accuracy</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[96%] h-full bg-gradient-primary"></div>
                    </div>
                    <span className="text-sm font-medium">96%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">SOP Adherence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-gradient-primary"></div>
                    </div>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Escalation Table */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Escalation Management
            </CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-7 gap-4 pb-3 border-b text-sm font-medium text-muted-foreground">
                  <div>Case Name</div>
                  <div>Paralegal</div>
                  <div>Issue</div>
                  <div>Priority</div>
                  <div>Status</div>
                  <div>Date</div>
                  <div>Actions</div>
                </div>
                
                <div className="space-y-3 pt-3">
                  {escalationItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-7 gap-4 py-3 bg-background/50 rounded-lg px-3 text-sm">
                      <div className="font-medium truncate">{item.caseName}</div>
                      <div className="truncate">{item.paralegal}</div>
                      <div className="truncate">{item.issue}</div>
                      <div>
                        <Badge 
                          variant={
                            item.priority === 'high' ? 'destructive' :
                            item.priority === 'medium' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <div>
                        <Badge 
                          variant={
                            item.status === 'resolved' ? 'default' :
                            item.status === 'in-progress' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">{item.dateReported}</div>
                      <div>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Download */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Download compliance and performance reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{report.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {report.type} • {report.date} • {report.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}