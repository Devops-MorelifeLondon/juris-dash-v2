"use client";

import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Download, Scale } from "lucide-react";


const complianceMetrics = [
  { title: "SOP Compliance", value: 94, target: 95, status: "warning" },
  { title: "Task Completion Rate", value: 98, target: 90, status: "success" },
  { title: "Time Tracking Accuracy", value: 96, target: 95, status: "success" },
  { title: "Document Quality Score", value: 89, target: 90, status: "warning" },
];

const complianceStandards = [
  { 
    name: "ABA Compliance", 
    description: "American Bar Association guidelines.",
    icon: Scale, 
    verified: true, 
    lastVerified: "2025-09-01" 
  },
  { 
    name: "HIPAA Certified", 
    description: "Health Insurance Portability and Accountability Act.",
    icon: Shield, 
    verified: true, 
    lastVerified: "2025-08-15" 
  },
  { 
    name: "GDPR Ready", 
    description: "General Data Protection Regulation.",
    icon: Shield, 
    verified: false, 
    lastVerified: "N/A" 
  },
];

const escalationItems = [
  {
    id: 1,
    caseName: "Johnson v. Smith Divorce",
    paralegal: "Sarah Chen",
    issue: "Missing client signature verification",
    status: "pending",
    priority: "high",
    dateReported: "2025-09-15",
    estimatedResolution: "2025-09-17"
  },
  {
    id: 2,
    caseName: "ABC Corp Formation",
    paralegal: "Michael Rodriguez",
    issue: "Incomplete state filing documentation",
    status: "in-progress",
    priority: "medium",
    dateReported: "2025-09-14",
    estimatedResolution: "2025-09-16"
  },
  {
    id: 3,
    caseName: "Personal Injury - Wilson",
    paralegal: "Emily Watson",
    issue: "Medical records timestamp discrepancy",
    status: "resolved",
    priority: "low",
    dateReported: "2025-09-13",
    estimatedResolution: "2025-09-15"
  }
];

const reports = [
  { name: "Weekly Compliance Summary", type: "PDF", date: "Sep 15, 2025", size: "2.4 MB" },
  { name: "Paralegal Performance Report", type: "Excel", date: "Sep 15, 2025", size: "1.8 MB" },
  { name: "SOP Deviation Analysis", type: "PDF", date: "Sep 14, 2025", size: "3.2 MB" },
  { name: "Time Tracking Report", type: "CSV", date: "Sep 14, 2025", size: "856 KB" }
];

export default function Compliance() {
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Compliance & Reports
            </h1>
            <p className="text-gray-500 mt-1">
              Monitor compliance metrics, regulatory adherence, and generate reports.
            </p>
          </div>
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* --- COMPLIANCE BADGES SECTION --- */}
        <Card className="bg-white border shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Regulatory Adherence</CardTitle>
                <CardDescription className="text-sm text-gray-500">Verification status of major compliance standards.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complianceStandards.map((standard, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg bg-gray-50/50">
                        <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full mr-4 ${standard.verified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                            <standard.icon className={`h-6 w-6 ${standard.verified ? 'text-green-600' : 'text-yellow-600'}`} />
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-semibold text-gray-800">{standard.name}</h4>
                            <p className="text-xs text-gray-500">{standard.description}</p>
                             {standard.verified ? (
                                <div className="flex items-center text-xs text-green-700 mt-1">
                                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                    <span>Verified: {standard.lastVerified}</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-xs text-yellow-700 mt-1">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    <span>Verification Pending</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>


        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceMetrics.map((metric, index) => (
            <Card key={index} className="bg-white border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    metric.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {metric.status === 'success' ? 
                      <CheckCircle className="h-5 w-5 text-green-600" /> :
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    }
                  </div>
                  <Badge variant={metric.status === 'success' ? 'default' : 'secondary'} className={`${
                    metric.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {metric.value}%
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-2 text-gray-800">{metric.title}</h3>
                <Progress value={metric.value} className="h-2 mb-2" />
                <p className="text-xs text-gray-500">
                  Target: {metric.target}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Recent Alerts
              </CardTitle>
              <CardDescription>AI-detected compliance issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert className="border-yellow-200 bg-yellow-50/50">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-sm text-yellow-800">
                  <strong>SOP Deviation:</strong> Johnson case missing required client verification step
                </AlertDescription>
              </Alert>
              
              <Alert className="border-blue-200 bg-blue-50/50">
                <Clock className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm text-blue-800">
                  <strong>Time Tracking:</strong> 3 entries require supervisor approval
                </AlertDescription>
              </Alert>
              
              <Alert className="border-green-200 bg-green-50/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-sm text-green-800">
                  <strong>Quality Check:</strong> All documents passed automated review
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                Performance Trends
              </CardTitle>
              <CardDescription>7-day compliance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Document Quality</span>
                  <div className="flex items-center gap-2">
                    <Progress value={89} className="w-20 h-2" />
                    <span className="text-sm font-medium text-gray-800">89%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Accuracy</span>
                  <div className="flex items-center gap-2">
                     <Progress value={96} className="w-20 h-2" />
                    <span className="text-sm font-medium text-gray-800">96%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SOP Adherence</span>
                  <div className="flex items-center gap-2">
                     <Progress value={94} className="w-20 h-2" />
                    <span className="text-sm font-medium text-gray-800">94%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Escalation Table */}
        <Card className="bg-white border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Shield className="h-5 w-5 text-gray-600" />
              Escalation Management
            </CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-7 gap-4 pb-3 border-b text-sm font-medium text-gray-500 px-3">
                  <div className="col-span-1">Case Name</div>
                  <div className="col-span-1">Paralegal</div>
                  <div className="col-span-2">Issue</div>
                  <div className="col-span-1">Priority</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>
                
                <div className="space-y-2 pt-2">
                  {escalationItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-7 gap-4 items-center py-3 px-3 hover:bg-gray-50/50 rounded-lg text-sm">
                      <div className="font-medium truncate text-gray-800">{item.caseName}</div>
                      <div className="truncate text-gray-600">{item.paralegal}</div>
                      <div className="truncate text-gray-600 col-span-2">{item.issue}</div>
                      <div>
                        <Badge 
                          variant={
                            item.priority === 'high' ? 'destructive' :
                            item.priority === 'medium' ? 'secondary' : 'outline'
                          }
                          className="text-xs capitalize"
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
                           className={`text-xs capitalize ${item.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-700">
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
        <Card className="bg-white border shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Available Reports</CardTitle>
            <CardDescription>Download compliance and performance reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-800">{report.name}</h4>
                      <p className="text-xs text-gray-500">
                        {report.type} • {report.date} • {report.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                    <Download className="h-5 w-5" />
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
