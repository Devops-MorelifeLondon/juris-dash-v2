import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Award, Clock, Star, Users, BookOpen } from "lucide-react";

const paralegals = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    specialization: "Family Law",
    completion: 95,
    currentAssignment: "Divorce Proceedings - Johnson Case",
    rating: 4.9,
    completedModules: 12,
    totalModules: 13
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    avatar: "/placeholder.svg", 
    specialization: "Personal Injury",
    completion: 87,
    currentAssignment: "Medical Records Review",
    rating: 4.8,
    completedModules: 15,
    totalModules: 17
  },
  {
    id: 3,
    name: "Emily Watson",
    avatar: "/placeholder.svg",
    specialization: "Real Estate",
    completion: 92,
    currentAssignment: "Contract Analysis - Property Deal",
    rating: 4.9,
    completedModules: 18,
    totalModules: 19
  },
];

const trainingModules = [
  { name: "Legal Research Fundamentals", duration: "2 hours", status: "completed" },
  { name: "Citation Practices", duration: "1.5 hours", status: "completed" },
  { name: "Client Communication", duration: "3 hours", status: "in-progress" },
  { name: "Document Drafting", duration: "4 hours", status: "pending" },
  { name: "SOP Compliance", duration: "2.5 hours", status: "pending" },
];

export default function Training() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Paralegal Training
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor progress and assign training modules
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <BookOpen className="h-4 w-4 mr-2" />
            Assign Training
          </Button>
        </div>

        {/* Training Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Trainees</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">91%</p>
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
                  <p className="text-sm text-muted-foreground">Avg. Hours</p>
                  <p className="text-2xl font-bold">156</p>
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
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Paralegal Progress */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Paralegal Progress
            </CardTitle>
            <CardDescription>Track individual progress and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {paralegals.map((paralegal) => (
                <Card key={paralegal.id} className="bg-background/50 border-border/50 hover:shadow-elegant transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={paralegal.avatar} />
                        <AvatarFallback>{paralegal.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{paralegal.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {paralegal.specialization}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        <span className="text-sm font-medium">{paralegal.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Training Progress</span>
                          <span className="font-medium">{paralegal.completion}%</span>
                        </div>
                        <Progress value={paralegal.completion} className="h-2" />
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Current Assignment</p>
                        <p className="text-sm font-medium truncate">{paralegal.currentAssignment}</p>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{paralegal.completedModules}/{paralegal.totalModules} modules</span>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Modules */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Training Modules</CardTitle>
            <CardDescription>Available courses and progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainingModules.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      module.status === 'completed' ? 'bg-success' :
                      module.status === 'in-progress' ? 'bg-warning' : 'bg-muted'
                    }`} />
                    <div>
                      <h4 className="font-medium">{module.name}</h4>
                      <p className="text-sm text-muted-foreground">{module.duration}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      module.status === 'completed' ? 'default' :
                      module.status === 'in-progress' ? 'secondary' : 'outline'
                    }
                  >
                    {module.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}