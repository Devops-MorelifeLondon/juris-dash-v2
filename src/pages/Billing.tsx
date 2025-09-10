import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, DollarSign, TrendingUp, Calendar, AlertCircle, MapPin } from "lucide-react";

const subscriptionData = {
  plan: "Professional",
  monthlyFee: 2500,
  billingCycle: "Monthly",
  nextBilling: "Feb 15, 2024",
  status: "active"
};

const usageData = [
  { service: "Family Law", hours: 156, cost: 23400, location: "USA" },
  { service: "Personal Injury", hours: 89, cost: 10680, location: "India" },
  { service: "Real Estate", hours: 72, cost: 7200, location: "India" },
  { service: "Business Law", hours: 45, cost: 7200, location: "USA" },
  { service: "Accounting", hours: 120, cost: 9600, location: "India" }
];

const invoices = [
  { id: "INV-2024-001", date: "Jan 15, 2024", amount: 58080, status: "paid", dueDate: "Jan 30, 2024" },
  { id: "INV-2023-012", date: "Dec 15, 2023", amount: 62150, status: "paid", dueDate: "Dec 30, 2023" },
  { id: "INV-2023-011", date: "Nov 15, 2023", amount: 45220, status: "paid", dueDate: "Nov 30, 2023" },
  { id: "INV-2023-010", date: "Oct 15, 2023", amount: 51900, status: "paid", dueDate: "Oct 30, 2023" }
];

const paymentAlerts = [
  { type: "upcoming", message: "Next payment of $2,500 due in 15 days", severity: "info" },
  { type: "overdue", message: "Late payment fee applied to invoice INV-2024-002", severity: "warning" },
  { type: "success", message: "Payment processed successfully for current period", severity: "success" }
];

export default function Billing() {
  const totalMonthlyUsage = usageData.reduce((sum, item) => sum + item.cost, 0);
  const totalHours = usageData.reduce((sum, item) => sum + item.hours, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Billing & Payments
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage subscription and track usage costs
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </div>

        {/* Billing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Total</p>
                  <p className="text-2xl font-bold">${(subscriptionData.monthlyFee + totalMonthlyUsage).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usage Cost</p>
                  <p className="text-2xl font-bold">${totalMonthlyUsage.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{totalHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rate</p>
                  <p className="text-2xl font-bold">${Math.round(totalMonthlyUsage / totalHours)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Details & Payment Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Overview
              </CardTitle>
              <CardDescription>Current plan and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge variant="outline">{subscriptionData.plan}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Fee</span>
                <span className="font-medium">${subscriptionData.monthlyFee.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Billing Cycle</span>
                <span className="font-medium">{subscriptionData.billingCycle}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next Billing</span>
                <span className="font-medium">{subscriptionData.nextBilling}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span>Usage this month</span>
                  <span>75% of typical</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Payment Alerts
              </CardTitle>
              <CardDescription>Important billing notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alert.severity === 'success' ? 'bg-success/5 border-success/20' :
                  alert.severity === 'warning' ? 'bg-warning/5 border-warning/20' :
                  'bg-info/5 border-info/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`h-4 w-4 mt-0.5 ${
                      alert.severity === 'success' ? 'text-success' :
                      alert.severity === 'warning' ? 'text-warning' :
                      'text-info'
                    }`} />
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Update Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Usage Breakdown */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Service Usage Breakdown</CardTitle>
            <CardDescription>Detailed cost analysis by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-5 gap-4 pb-3 border-b text-sm font-medium text-muted-foreground">
                  <div>Service</div>
                  <div>Hours</div>
                  <div>Location</div>
                  <div>Cost</div>
                  <div>Rate</div>
                </div>
                
                <div className="space-y-3 pt-3">
                  {usageData.map((item, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 py-3 bg-background/50 rounded-lg px-3">
                      <div className="font-medium">{item.service}</div>
                      <div className="text-sm">{item.hours}h</div>
                      <div>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </Badge>
                      </div>
                      <div className="font-medium">${item.cost.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        ${Math.round(item.cost / item.hours)}/hr
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="grid grid-cols-5 gap-4 font-semibold">
                    <div>Total</div>
                    <div>{totalHours}h</div>
                    <div>-</div>
                    <div>${totalMonthlyUsage.toLocaleString()}</div>
                    <div>${Math.round(totalMonthlyUsage / totalHours)}/hr</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Past billing statements and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{invoice.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        Issued: {invoice.date} • Due: {invoice.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                      <Badge variant="default" className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}