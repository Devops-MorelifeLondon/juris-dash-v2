import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

export default function CheckoutForm({ amount, serviceName, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure this route exists in your App.js/Router
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    // This block only runs on error (success redirects immediately)
    if (error) {
      setMessage(error.message);
    } 
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold text-foreground">{serviceName}</h3>
        <p className="text-2xl font-bold text-primary">{amount}</p>
      </div>
      
      <PaymentElement />
      
      {message && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
            {message}
        </div>
      )}
      
      <div className="flex gap-3 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="w-1/3"
        >
          Cancel
        </Button>
        <Button 
          disabled={isLoading || !stripe || !elements} 
          type="submit" 
          className="w-2/3"
        >
          {isLoading ? "Processing..." : `Pay ${amount}`}
        </Button>
      </div>
    </form>
  );
}