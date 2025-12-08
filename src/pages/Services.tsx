import React, { useState } from 'react';
import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/payment/CheckoutForm"; 
import { Package, Users, Scale, Home, ScrollText, Lightbulb, Briefcase, CheckCircle, MapPin } from "lucide-react";
import { apiClient } from '@/lib/api/config';

// REPLACE WITH YOUR PUBLISHABLE KEY
const stripePromise = loadStripe("pk_test_51PtoHBSAesGGuP4gdOJJ7iOllV3BgaEb9zbOfzRhNOhqhAgo07YsGOcCmFoOXBz6VUiXQqK1SLIYvJbNG2VHuiPN00AO28oecE"); 

const practiceAreas = [
  {
    id: "family-law",
    name: "Family Law",
    icon: <Users className="w-6 h-6 text-white" />,
    shortDesc: "Divorce, custody, prenups",
    description: "Custody agreements, divorce petitions, prenups, and more.",
    stats: "1,200+ custody agreements drafted in 2024 with 98% client satisfaction.",
    services: ["Divorce Petitions", "Child Custody Agreements", "Prenup & Postnup Drafting"],
    pricing: [
      { plan: "Basic", hours: "40 hrs/mo", price: "$400", stripePriceId: "price_fl_basic" },
      { plan: "Standard", hours: "80 hrs/mo", price: "$750", stripePriceId: "price_fl_standard" },
      { plan: "Premium", hours: "160 hrs/mo", price: "$1400", stripePriceId: "price_fl_premium" },
    ],
  },

  {
    id: "personal-injury",
    name: "Personal Injury",
    icon: <Scale className="w-6 h-6 text-white" />,
    shortDesc: "Case intake, medical reviews",
    description: "Drafting, filing, and litigation support for injury claims.",
    stats: "Reduced review time by 40% for a leading NYC law firm.",
    services: ["Claim Filing", "Medical Record Review", "Litigation Prep"],
    pricing: [
      { plan: "Basic", hours: "40 hrs/mo", price: "$420", stripePriceId: "price_pi_basic" },
      { plan: "Standard", hours: "80 hrs/mo", price: "$800", stripePriceId: "price_pi_standard" },
      { plan: "Premium", hours: "160 hrs/mo", price: "$1500", stripePriceId: "price_pi_premium" },
    ],
  },

  {
    id: "real-estate",
    name: "Real Estate",
    icon: <Home className="w-6 h-6 text-white" />,
    shortDesc: "Lease reviews, closings",
    description: "Property contracts, lease agreements, and title reviews.",
    stats: "Handled 500+ property closings with zero compliance issues.",
    services: ["Lease Agreements", "Purchase Contracts", "Title Searches"],
    pricing: [
      { plan: "Basic", hours: "40 hrs/mo", price: "$450", stripePriceId: "price_re_basic" },
      { plan: "Standard", hours: "80 hrs/mo", price: "$850", stripePriceId: "price_re_standard" },
      { plan: "Premium", hours: "160 hrs/mo", price: "$1600", stripePriceId: "price_re_premium" },
    ],
  },

  {
    id: "estate-planning",
    name: "Estate Planning",
    icon: <ScrollText className="w-6 h-6 text-white" />,
    shortDesc: "Wills, trusts, probate",
    description: "Wills, trusts, and probate support for clients.",
    stats: "Drafted 700+ wills & trusts in 2024.",
    services: ["Wills & Trusts", "Power of Attorney", "Probate Assistance"],
    pricing: [
      { plan: "Basic", hours: "20 hrs", price: "$500", stripePriceId: "price_ep_basic" },
      { plan: "Standard", hours: "40 hrs", price: "$950", stripePriceId: "price_ep_standard" },
      { plan: "Comprehensive", hours: "60 hrs", price: "$1350", stripePriceId: "price_ep_comprehensive" },
    ],
  },

  {
    id: "intellectual-property",
    name: "Intellectual Property",
    icon: <Lightbulb className="w-6 h-6 text-white" />,
    shortDesc: "Trademarks, patents",
    description: "Protect and manage your IP portfolio.",
    stats: "Filed 1,000+ trademarks globally in 2024.",
    services: ["Trademarks", "Copyrights", "Patents"],
    pricing: [
      { plan: "Starter", hours: "10 hrs", price: "$800", stripePriceId: "price_ip_starter" },
      { plan: "Growth", hours: "25 hrs", price: "$1800", stripePriceId: "price_ip_growth" },
      { plan: "Enterprise", hours: "50+ hrs", price: "Custom", stripePriceId: null },
    ],
  },

  {
    id: "business-law",
    name: "Business Law",
    icon: <Briefcase className="w-6 h-6 text-white" />,
    shortDesc: "Contracts, M&A support",
    description: "Entity formation, compliance, and contracts.",
    stats: "Supported 300+ incorporations in the U.S.",
    services: ["Contracts", "Shareholder Agreements", "M&A Support"],
    pricing: [
      { plan: "Basic", hours: "30 hrs/mo", price: "$600", stripePriceId: "price_bl_basic" },
      { plan: "Standard", hours: "60 hrs/mo", price: "$1100", stripePriceId: "price_bl_standard" },
      { plan: "Premium", hours: "120 hrs/mo", price: "$2000", stripePriceId: "price_bl_premium" },
    ],
  },
];


export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 = Address, 2 = Payment
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  
  // Address State
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US" // Default to US (cannot be 'IN' for exports)
  });

  // Step 1: Open Modal
  const handleBookNow = (serviceName, pricingObj) => {
    setSelectedService({ 
        name: serviceName, 
        price: pricingObj.price,
        plan: pricingObj.plan,
        stripePriceId: pricingObj.stripePriceId 
    });
    setStep(1); 
    setClientSecret(""); 
    setIsModalOpen(true);
  };

  // Step 2: Submit Address -> Get Secret
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/api/create-payment-intent", {
        serviceName: selectedService.name,
        price: selectedService.price,
        plan: selectedService.plan,
        stripePriceId: selectedService.stripePriceId,
        address: address // Sending Address to Backend
      });

      if(response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
          setStep(2); // Move to Payment Step
      }
    } catch (error) {
      console.error("Payment Init Failed:", error);
      alert(error.response?.data?.error || "Failed to initialize payment.");
    } finally {
      setLoading(false);
    }
  };

  const options = {
    clientSecret,
    theme: "stripe",
    appearance: { theme: 'stripe', labels: 'floating' },
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
        
        <h1 className="text-3xl font-bold">Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {practiceAreas.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.shortDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    {service.services.map(s => <div key={s} className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500"/>{s}</div>)}
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  {service.pricing.map((p) => (
                    <Button key={p.plan} size="sm" onClick={() => handleBookNow(service.name, p)}>
                      {p.plan} – {p.price}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- MODAL --- */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 ? "Billing Address" : "Payment Details"}
                    </DialogTitle>
                </DialogHeader>
                
                {/* STEP 1: ADDRESS FORM */}
                {step === 1 && (
                    <form onSubmit={handleAddressSubmit} className="space-y-3 mt-2">
                        <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded flex gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Address required for international regulations.</span>
                        </div>
                        
                        <div>
                            <Label>Address Line 1</Label>
                            <Input required value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})} placeholder="123 Main St" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>City</Label><Input required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} /></div>
                            <div><Label>State</Label><Input value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Zip Code</Label><Input required value={address.postal_code} onChange={(e) => setAddress({...address, postal_code: e.target.value})} /></div>
                            <div><Label>Country (ISO)</Label><Input required maxLength={2} value={address.country} onChange={(e) => setAddress({...address, country: e.target.value.toUpperCase()})} placeholder="US" /></div>
                        </div>
                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                            {loading ? "Processing..." : "Next: Payment"}
                        </Button>
                    </form>
                )}

                {/* STEP 2: PAYMENT ELEMENT */}
                {step === 2 && clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm 
                            amount={selectedService?.price} 
                            serviceName={selectedService?.name}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </Elements>
                )}
            </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}