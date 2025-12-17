"use client";

import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, DollarSign, TrendingUp, Calendar, AlertCircle, Loader2, Clock } from "lucide-react";
import {apiClient} from "@/lib/api/config";
import { format, isPast, addDays, differenceInDays } from "date-fns";

// --- Types matching your API Response ---

interface InvoiceItem {
  _id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled' | 'Void';
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
  paralegal: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/billing/invoices");
        if (response.data.success) {
          setInvoices(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch billing:", err);
        setError("Unable to load billing history.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // --- 2. Derived Metrics (No Hardcoding) ---
  const billingStats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Sort: Newest first
    const sortedInvoices = [...invoices].sort((a, b) => 
      new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    );

    const latestInvoice = sortedInvoices[0] || null;

    // A. Outstanding Balance (Sum of Unpaid/Overdue/Sent)
    const outstandingBalance = sortedInvoices
      .filter(inv => ['Sent', 'Overdue'].includes(inv.status))
      .reduce((acc, inv) => acc + inv.totalAmount, 0);

    // B. Paid Year to Date
    const paidYTD = sortedInvoices
      .filter(inv => inv.status === 'Paid' && new Date(inv.issueDate).getFullYear() === currentYear)
      .reduce((acc, inv) => acc + inv.totalAmount, 0);

    // C. Recent Items (Extract items from the latest invoice for the breakdown view)
    const recentItems = latestInvoice ? latestInvoice.items : [];

    // D. Total Hours Billed (From latest invoice)
    const latestHours = recentItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      latestInvoice,
      outstandingBalance,
      paidYTD,
      recentItems,
      latestHours
    };
  }, [invoices]);

  // --- 3. Dynamic Alerts ---
  const paymentAlerts = useMemo(() => {
    const alerts = [];
    
    // Check for Overdue
    const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');
    if (overdueInvoices.length > 0) {
      alerts.push({ 
        type: "overdue", 
        message: `Action Required: ${overdueInvoices.length} invoice(s) are overdue.`, 
        severity: "destructive" 
      });
    }

    // Check for Due Soon (Next 7 days)
    const dueSoon = invoices.filter(inv => {
      if (inv.status !== 'Sent') return false;
      const daysUntilDue = differenceInDays(new Date(inv.dueDate), new Date());
      return daysUntilDue >= 0 && daysUntilDue <= 7;
    });

    if (dueSoon.length > 0) {
      alerts.push({
        type: "upcoming",
        message: `Reminder: ${dueSoon.length} invoice(s) due this week.`,
        severity: "warning"
      });
    }

    // Success State
    if (alerts.length === 0 && invoices.length > 0) {
      alerts.push({ 
        type: "success", 
        message: "Your account is in good standing.", 
        severity: "success" 
      });
    } else if (invoices.length === 0) {
      alerts.push({ 
        type: "info", 
        message: "No invoices generated yet.", 
        severity: "info" 
      });
    }

    return alerts;
  }, [invoices]);

  // --- Loading State ---
  if (loading) {
    return (
      <Layout>
        <div className="w-full h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Billing & Payments
            </h1>
            <p className="text-muted-foreground mt-1">
              Track invoices, payments, and service costs
            </p>
          </div>
          <Button className="w-full sm:w-auto" disabled={invoices.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Statement
          </Button>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <p className="text-2xl font-bold">${billingStats.outstandingBalance.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid (YTD)</p>
                  <p className="text-2xl font-bold">${billingStats.paidYTD.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Most Recent Invoice</p>
                  <p className="text-2xl font-bold">
                    ${billingStats.latestInvoice?.totalAmount.toLocaleString() || "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Billing Status & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Replaced "Subscription Overview" with "Latest Statement Status" */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Statement Status
              </CardTitle>
              <CardDescription>Details of your most recent invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingStats.latestInvoice ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Invoice Number</span>
                    <span className="font-medium">{billingStats.latestInvoice.invoiceNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Issue Date</span>
                    <span className="font-medium">{format(new Date(billingStats.latestInvoice.issueDate), "MMM dd, yyyy")}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <span className="font-medium">{format(new Date(billingStats.latestInvoice.dueDate), "MMM dd, yyyy")}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Billed Hours</span>
                    <span className="font-medium">{billingStats.latestHours.toFixed(2)} hrs</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={billingStats.latestInvoice.status === 'Paid' ? 'secondary' : 'default'}>
                      {billingStats.latestInvoice.status}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Visual indicator of payment timeline */}
                  <div className="pt-2">
                     <div className="flex justify-between text-sm mb-2">
                      <span>Payment Timeline</span>
                      {billingStats.latestInvoice.status === 'Paid' ? (
                        <span className="text-success text-xs">Completed</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                           {differenceInDays(new Date(billingStats.latestInvoice.dueDate), new Date())} days remaining
                        </span>
                      )}
                    </div>
                    <Progress 
                      value={billingStats.latestInvoice.status === 'Paid' ? 100 : 50} 
                      className="h-2" 
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No invoices found on file.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Alerts */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Billing alerts and reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alert.severity === 'success' ? 'bg-success/5 border-success/20' :
                  alert.severity === 'destructive' ? 'bg-destructive/5 border-destructive/20' :
                  'bg-warning/5 border-warning/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`h-4 w-4 mt-0.5 ${
                      alert.severity === 'success' ? 'text-success' :
                      alert.severity === 'destructive' ? 'text-destructive' :
                      'text-warning'
                    }`} />
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4" disabled={billingStats.outstandingBalance <= 0}>
                <CreditCard className="h-4 w-4 mr-2" />
                {billingStats.outstandingBalance > 0 ? "Pay Now" : "Manage Payment Methods"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Latest Invoice Item Breakdown */}
        {billingStats.recentItems.length > 0 && (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Latest Service Breakdown</CardTitle>
              <CardDescription>Itemized costs from invoice {billingStats.latestInvoice?.invoiceNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-4 gap-4 pb-3 border-b text-sm font-medium text-muted-foreground">
                    <div className="col-span-2">Description</div>
                    <div className="text-right">Hours</div>
                    <div className="text-right">Amount</div>
                  </div>
                  
                  <div className="space-y-3 pt-3">
                    {billingStats.recentItems.map((item, index) => (
                      <div key={item._id || index} className="grid grid-cols-4 gap-4 py-3 bg-background/50 rounded-lg px-3 items-center">
                        <div className="col-span-2 font-medium truncate" title={item.description}>
                          {item.description}
                        </div>
                        <div className="text-sm text-right">{item.quantity}h</div>
                        <div className="font-medium text-right">${item.amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoice History Table */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Complete record of all invoices and payments</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(invoice.issueDate), "MMM dd, yyyy")} • Due: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <div className="text-right">
                        <p className="font-medium">${invoice.totalAmount.toLocaleString()}</p>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            invoice.status === 'Paid' ? 'border-success text-success' : 
                            invoice.status === 'Overdue' ? 'border-destructive text-destructive' :
                            'border-primary text-primary'
                          }`}
                        >
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
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No history available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}