import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Scale,
  Home,
  ScrollText,
  Lightbulb,
  Briefcase,
  Globe,
  BarChart,
  Calculator,
  BookOpen,
  FileText,
  CheckCircle,
} from "lucide-react";

const practiceAreas = [
  {
    id: "family-law",
    name: "Family Law",
    icon: <Users className="w-6 h-6 text-white" />,
    shortDesc: "Divorce, custody, prenups",
    description: "Custody agreements, divorce petitions, prenups, and more.",
    stats:
      "1,200+ custody agreements drafted in 2024 with 98% client satisfaction.",
    services: [
      "Divorce Petitions",
      "Child Custody Agreements",
      "Prenup & Postnup Drafting",
    ],
    pricing: [
      { plan: "Basic", hours: "40 hrs/mo", price: "$400" },
    ],
  },
  {
    id: "personal-injury",
    name: "Personal Injury",
    icon: <Scale className="w-6 h-6 text-white" />,
    shortDesc: "Case intake, medical reviews",
    description: "Drafting, filing, and litigation support for injury claims.",
    stats: "Reduced review time by 40% for a leading NYC law firm.",
    services: [
      "Claim Filing",
      "Medical Record Review",
      "Litigation Prep",
    ],
    pricing: [
      { plan: "Basic", hours: "40 hrs/mo", price: "$420" },
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: <Home className="w-6 h-6 text-white" />,
    shortDesc: "Lease reviews, closings",
    description: "Property contracts, lease agreements, and title reviews.",
    stats: "Handled 500+ property closings with zero compliance issues.",
    services: [
      "Lease Agreements",
      "Purchase Contracts",
      "Title Searches",
    ],
    pricing: [
      { plan: "Basic", hours: "40 hrs/mo", price: "$450" },
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
      { plan: "Basic", hours: "20 hrs", price: "$500" },
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
      { plan: "Starter", hours: "10 hrs", price: "$800" },
    ],
  },
  {
    id: "business-law",
    name: "Business Law",
    icon: <Briefcase className="w-6 h-6 text-white" />,
    shortDesc: "Contracts, M&A support",
    description: "Entity formation, compliance, and contracts.",
    stats: "Supported 300+ incorporations in the U.S.",
    services: [
      "Contracts",
      "Shareholder Agreements",
      "M&A Support",
    ],
    pricing: [
      { plan: "Basic", hours: "30 hrs/mo", price: "$600" },
    ],
  },
];

// Calculate dynamic stats from the data
const totalServices = practiceAreas.length;
const totalSubServices = practiceAreas.reduce((acc, area) => acc + area.services.length, 0);

export default function Services() {
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Practice Areas
            </h1>
            <p className="text-muted-foreground mt-1">
              Expert legal and financial support, tailored to your needs.
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Package className="h-4 w-4 mr-2" />
            Request Custom Service
          </Button>
        </div>

        {/* Service Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Practice Areas</p>
                  <p className="text-2xl font-bold">{totalServices}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Specialized Services</p>
                  <p className="text-2xl font-bold">{totalSubServices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Avg. Turnaround</p>
                    <p className="text-2xl font-bold">24 Hrs</p>
                </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {practiceAreas.map((service) => (
            <Card key={service.id} className="bg-gradient-card border-border/50 hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-sm">{service.shortDesc}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-3">{service.stats}</p>
                    <div className="space-y-2">
                    {service.services.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>{item}</span>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Starts at</span>
                      <span className="font-bold text-xl text-primary">{service.pricing[0].price}</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-9">
                    View Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Combinations */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Popular Service Combinations</CardTitle>
            <CardDescription>Get comprehensive support with our curated bundles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-2">Startup Launchpad</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Business Law + Intellectual Property + Accounting
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">$1,500/mo</span>
                  <Button size="sm">Select Bundle</Button>
                </div>
              </div>
              
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-2">Personal Security Pack</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Family Law + Estate Planning
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">$850/mo</span>
                  <Button size="sm">Select Bundle</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
