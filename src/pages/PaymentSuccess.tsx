import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Confetti from "react-confetti";
import { CheckCircle, Loader2, Home, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you have your UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Initialize Stripe (Must use the same key as your payment page)
const stripePromise = loadStripe("pk_test_51PtoHBSAesGGuP4gdOJJ7iOllV3BgaEb9zbOfzRhNOhqhAgo07YsGOcCmFoOXBz6VUiXQqK1SLIYvJbNG2VHuiPN00AO28oecE");

 const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  // Get params from URL
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    if (!clientSecret || !stripePromise) {
      setStatus("error");
      return;
    }

    stripePromise.then(async (stripe) => {
      // 1. Retrieve the PaymentIntent to verify status & get details
      const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);

      if (error) {
        console.error("Error fetching payment:", error);
        setStatus("error");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentDetails(paymentIntent);
        setStatus("success");
      } else {
        // Payment exists but isn't "succeeded" (e.g., processing or requires action)
        setStatus("processing");
      }
    });
  }, [clientSecret]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Verifying your payment...</h2>
        <p className="text-slate-500">Please do not close this window.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <CardTitle className="text-red-600">Payment Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              We couldn't verify your payment automatically. If you were charged, please contact support.
            </p>
            <div className="bg-slate-100 p-3 rounded text-xs font-mono text-slate-500 break-all">
              ID: {paymentIntentId || "Unknown"}
            </div>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 1. Confetti Animation (Only runs on success) */}
      <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />

      <Card className="w-full max-w-lg shadow-xl border-t-8 border-t-green-500 animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">Payment Successful!</CardTitle>
          <p className="text-slate-500 mt-2">
            Thank you for your order. A confirmation email has been sent to you.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* 2. Transaction Receipt Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 border-dashed">
              <span className="text-slate-500 text-sm">Amount Paid</span>
              <span className="text-xl font-bold text-slate-900">
                ${(paymentDetails?.amount / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono text-slate-700">{paymentDetails?.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Date</span>
              <span className="text-slate-700">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Payment Method</span>
              <span className="text-slate-700 capitalize">
                {paymentDetails?.payment_method_types?.[0] || "Card"} ending ****
              </span>
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" /> Download Receipt
            </Button>
            <Button 
              className="w-full gap-2 bg-primary hover:bg-primary/90"
              onClick={() => navigate("/")} // Or wherever you want them to go
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate("/")}
              className="text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <Home className="w-3 h-3" /> Return to Home
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
export default PaymentSuccess;