import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, MapPin, Clock, DollarSign, Users, Star } from "lucide-react";

const serviceCategories = [
  {
    name: "Family Law",
    description: "Divorce, custody, adoption cases",
    deliveryOptions: ["USA", "India"],
    basePrice: "$150/hour",
    trainedParalegals: 8,
    completionTime: "2-3 days",
    icon: "👨‍👩‍👧‍👦"
  },
  {
    name: "Personal Injury",
    description: "Accident claims, medical malpractice",
    deliveryOptions: ["USA", "India"],
    basePrice: "$120/hour",
    trainedParalegals: 12,
    completionTime: "1-2 days",
    icon: "🏥"
  },
  {
    name: "Real Estate",
    description: "Property transactions, contracts",
    deliveryOptions: ["USA", "India"],
    basePrice: "$100/hour",
    trainedParalegals: 6,
    completionTime: "3-5 days",
    icon: "🏠"
  },
  {
    name: "Estate Planning",
    description: "Wills, trusts, probate",
    deliveryOptions: ["USA"],
    basePrice: "$180/hour",
    trainedParalegals: 4,
    completionTime: "4-7 days",
    icon: "📜"
  },
  {
    name: "Intellectual Property",
    description: "Patents, trademarks, copyrights",
    deliveryOptions: ["USA", "India"],
    basePrice: "$200/hour",
    trainedParalegals: 5,
    completionTime: "5-10 days",
    icon: "💡"
  },
  {
    name: "Business Law",
    description: "Corporate formation, contracts",
    deliveryOptions: ["USA", "India"],
    basePrice: "$160/hour",
    trainedParalegals: 10,
    completionTime: "2-4 days",
    icon: "🏢"
  },
  {
    name: "Immigration Services",
    description: "Visa applications, deportation defense",
    deliveryOptions: ["USA"],
    basePrice: "$140/hour",
    trainedParalegals: 7,
    completionTime: "3-6 days",
    icon: "🛂"
  },
  {
    name: "Bankruptcy",
    description: "Debt relief, reorganization",
    deliveryOptions: ["USA", "India"],
    basePrice: "$130/hour",
    trainedParalegals: 6,
    completionTime: "5-8 days",
    icon: "⚖️"
  },
  {
    name: "Accounting",
    description: "Financial statements, bookkeeping",
    deliveryOptions: ["India"],
    basePrice: "$80/hour",
    trainedParalegals: 15,
    completionTime: "1-3 days",
    icon: "📊"
  },
  {
    name: "Tax Preparation",
    description: "Tax returns, compliance",
    deliveryOptions: ["USA", "India"],
    basePrice: "$90/hour",
    trainedParalegals: 12,
    completionTime: "2-4 days",
    icon: "📋"
  }
];

export default function Services() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Service Bundles
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive legal and financial services
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Package className="h-4 w-4 mr-2" />
            Request Custom Bundle
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
                  <p className="text-sm text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold">10</p>
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
                  <p className="text-sm text-muted-foreground">Trained Staff</p>
                  <p className="text-2xl font-bold">85</p>
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
                  <p className="text-sm text-muted-foreground">Avg Delivery</p>
                  <p className="text-2xl font-bold">3.2d</p>
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
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {serviceCategories.map((service, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-xl">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-sm">{service.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {service.deliveryOptions.map((location) => (
                    <Badge key={location} variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{service.basePrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{service.completionTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {service.trainedParalegals}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {service.trainedParalegals} trained
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="h-8">
                    Assign Paralegal
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
            <CardDescription>Frequently requested service bundles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-2">Startup Legal Package</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Business Law + Intellectual Property + Accounting
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">$320/hour</span>
                  <Button size="sm">Select Bundle</Button>
                </div>
              </div>
              
              <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-2">Family Practice Combo</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Family Law + Estate Planning + Tax Preparation
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">$280/hour</span>
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