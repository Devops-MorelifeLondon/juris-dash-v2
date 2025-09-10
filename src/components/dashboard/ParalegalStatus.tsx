import { Clock, Star, MessageSquare, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ParalegalCardProps {
  paralegal: {
    id: string;
    name: string;
    avatar?: string;
    specialization: string;
    status: "online" | "offline" | "busy" | "training";
    currentAssignment?: string;
    hoursToday: number;
    tasksCompleted: number;
    rating: number;
    responseTime: string;
    certificationLevel: "junior" | "senior" | "expert";
    languages: string[];
    location: "USA" | "India";
  };
}

function ParalegalCard({ paralegal }: ParalegalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-success";
      case "busy": return "bg-warning";
      case "training": return "bg-info";
      case "offline": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": return "Available";
      case "busy": return "In Session";
      case "training": return "Training";
      case "offline": return "Offline";
      default: return "Unknown";
    }
  };

  const getCertificationColor = (level: string) => {
    switch (level) {
      case "expert": return "bg-primary text-primary-foreground";
      case "senior": return "bg-success text-success-foreground";
      case "junior": return "bg-info text-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getLocationFlag = (location: string) => {
    return location === "USA" ? "🇺🇸" : "🇮🇳";
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] bg-gradient-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={paralegal.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {paralegal.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                getStatusColor(paralegal.status)
              )}>
                <div className="w-full h-full rounded-full animate-pulse-glow" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{paralegal.name}</h3>
                <span className="text-lg">{getLocationFlag(paralegal.location)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{paralegal.specialization}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", getCertificationColor(paralegal.certificationLevel))}>
                  {paralegal.certificationLevel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getStatusText(paralegal.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Assignment */}
        {paralegal.currentAssignment && (
          <div className="p-3 bg-accent/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Current Assignment</p>
            <p className="text-sm font-medium text-foreground">{paralegal.currentAssignment}</p>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Hours Today</span>
            </div>
            <p className="text-lg font-bold text-foreground">{paralegal.hoursToday}h</p>
            <Progress value={(paralegal.hoursToday / 8) * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Tasks Done</span>
            </div>
            <p className="text-lg font-bold text-foreground">{paralegal.tasksCompleted}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(paralegal.rating) 
                      ? "text-warning fill-current" 
                      : "text-muted-foreground/30"
                  )} 
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                {paralegal.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-info" />
            <span className="text-sm text-muted-foreground">Avg. Response</span>
          </div>
          <span className="text-sm font-medium text-foreground">{paralegal.responseTime}</span>
        </div>

        {/* Languages */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Languages</p>
          <div className="flex flex-wrap gap-1">
            {paralegal.languages.map((language) => (
              <Badge key={language} variant="secondary" className="text-xs">
                {language}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const mockParalegals = [
  {
    id: "1",
    name: "Sarah Chen",
    specialization: "Personal Injury & Litigation",
    status: "online" as const,
    currentAssignment: "Johnson v. Tech Corp Discovery",
    hoursToday: 6.5,
    tasksCompleted: 8,
    rating: 4.8,
    responseTime: "12m",
    certificationLevel: "expert" as const,
    languages: ["English", "Mandarin"],
    location: "USA" as const
  },
  {
    id: "2",
    name: "David Kumar",
    specialization: "Estate Planning & Probate",
    status: "busy" as const,
    currentAssignment: "Williams Trust Documentation",
    hoursToday: 7.2,
    tasksCompleted: 12,
    rating: 4.6,
    responseTime: "8m",
    certificationLevel: "senior" as const,
    languages: ["English", "Hindi"],
    location: "India" as const
  },
  {
    id: "3",
    name: "Lisa Rodriguez",
    specialization: "Real Estate & Commercial Law",
    status: "online" as const,
    currentAssignment: "Metro Properties Due Diligence",
    hoursToday: 5.8,
    tasksCompleted: 6,
    rating: 4.9,
    responseTime: "5m",
    certificationLevel: "expert" as const,
    languages: ["English", "Spanish"],
    location: "USA" as const
  },
  {
    id: "4",
    name: "Raj Patel",
    specialization: "Corporate & IP Law",
    status: "training" as const,
    hoursToday: 4.0,
    tasksCompleted: 3,
    rating: 4.3,
    responseTime: "15m",
    certificationLevel: "junior" as const,
    languages: ["English", "Gujarati"],
    location: "India" as const
  }
];

export function ParalegalStatus() {
  const onlineCount = mockParalegals.filter(p => p.status === "online").length;
  const totalCount = mockParalegals.length;
  
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">Paralegal Team</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">
                {onlineCount} of {totalCount} available
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow" />
                <span className="text-xs text-success font-medium">Live Status</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {mockParalegals.map((paralegal, index) => (
            <div
              key={paralegal.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ParalegalCard paralegal={paralegal} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}