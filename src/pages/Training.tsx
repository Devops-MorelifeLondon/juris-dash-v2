import React from "react";
import {
  Bot,
  Users,
  Brain,
  FileText,
  Zap,
  CheckCircle,
  ArrowRight,
  Target,
  Settings,
  BookOpen,
  Gavel,
  Shield,
  Play,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/ui/layout";

const TrainYourResource = () => {
  const workflowSteps = [
    {
      icon: Bot,
      title: "AgenticAI Processing",
      description:
        "AI generates compliant, formatted drafts based on court rules and attorney preferences.",
      color: "from-blue-500 to-cyan-400",
      status: "processing",
    },
    {
      icon: Users,
      title: "Human Paralegal Review",
      description:
        "Paralegal adds substantive content, legal research, and citations.",
      color: "from-purple-500 to-pink-400",
      status: "active",
    },
    {
      icon: CheckCircle,
      title: "Attorney Approval",
      description: "Final review and approval by the attorney before delivery.",
      color: "from-green-500 to-emerald-400",
      status: "pending",
    },
  ];

  const aiFeatures = [
    {
      icon: FileText,
      title: "Compliant Formatting",
      description:
        "Attorney-specific + court-rule-specific formatting applied automatically.",
      progress: 100,
    },
    {
      icon: Zap,
      title: "Hyperlinking & Citations",
      description:
        "Cross-references, exhibits, and Bluebook citations generated.",
      progress: 95,
    },
    {
      icon: Shield,
      title: "Error Detection",
      description:
        "Formatting, alignment, and style error detection and correction.",
      progress: 90,
    },
    {
      icon: Settings,
      title: "Custom Preferences",
      description: "Font, spacing, headings, tone, and page layout preferences.",
      progress: 85,
    },
  ];

  const humanTasks = [
    {
      icon: Brain,
      title: "Legal Research",
      description: "In-depth legal research and case law analysis.",
      specialist: "Research Specialist",
    },
    {
      icon: Gavel,
      title: "Substantive Drafting",
      description: "Arguments, motions, pleadings, and contract development.",
      specialist: "Legal Writer",
    },
    {
      icon: BookOpen,
      title: "Trial Preparation",
      description:
        "Support materials and documentation for court proceedings.",
      specialist: "Trial Assistant",
    },
    {
      icon: CheckCircle,
      title: "Final Review",
      description: "Accuracy verification and legal compliance checking.",
      specialist: "Quality Assurance",
    },
  ];

  const trainingModules = [
    {
      title: "Court Rules Training",
      description:
        "Pre-launch AI training on formatting, citations, and compliance standards.",
      status: "Pre-Launch Requirement",
      progress: 100,
      type: "system",
    },
    {
      title: "Attorney SOPs",
      description:
        "Custom training on attorney-specific style, tone, and preferences.",
      status: "Post-Launch Customization",
      progress: 75,
      type: "custom",
    },
    {
      title: "Document Templates",
      description:
        "Generate template-ready drafts for various legal document types.",
      status: "Ongoing Enhancement",
      progress: 60,
      type: "templates",
    },
  ];

  return (
     <Layout>
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 p-4 space-y-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary p-8 text-primary-foreground shadow-elegant">
            Train Your Own Resource
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Hybrid AgenticAI + Human Paralegal Model for Efficient,
            Attorney-Ready Legal Support
          </p>
        </div>

        {/* Workflow Visualization */}
        <Card className="bg-white shadow-lg border border-slate-200/80">
          <CardHeader className="bg-slate-100/70 p-6 border-b border-slate-200">
            <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
              <Target className="w-7 h-7 text-blue-600" />
              Hybrid Workflow Process
            </CardTitle>
            <CardDescription className="text-slate-500">
              AI handles automation, while humans focus on substantive legal work.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 relative">
              {/* Responsive Connector Line */}
              <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-slate-300" />
            

              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 px-4"
                >
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full">
                    <div
                      className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${step.color} shadow-lg`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 min-h-[40px]">
                      {step.description}
                    </p>
                    <Badge
                      className={`font-semibold capitalize
                        ${step.status === "processing"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : ""
                        }
                        ${step.status === "active"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : ""
                        }
                        ${step.status === "pending"
                          ? "bg-slate-100 text-slate-800 border-slate-200"
                          : ""
                        }`}
                    >
                      {step.status}
                    </Badge>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="absolute top-[45%] -right-3 w-6 h-6 text-slate-400 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="ai-features" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8 bg-slate-200/80 p-1.5 h-auto rounded-lg gap-1">
            {[
              { value: "ai-features", label: "AgenticAI Features", icon: Bot },
              { value: "human-tasks", label: "Human Expertise", icon: Users },
              { value: "training", label: "Training Modules", icon: BookOpen },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center justify-center gap-2 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md py-2.5 text-sm font-medium"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* AI Features Tab */}
          <TabsContent value="ai-features">
            <Card className="bg-white shadow-lg border border-slate-200/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Bot className="w-6 h-6" />
                  AgenticAI Core Capabilities
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Automated formatting, compliance, and structural tasks handled by AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-slate-50/70 p-6 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                          {feature.description}
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                            style={{ width: `${feature.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Human Tasks Tab */}
          <TabsContent value="human-tasks">
            <Card className="bg-white shadow-lg border border-slate-200/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Users className="w-6 h-6" />
                  Human Paralegal Responsibilities
                </CardTitle>
                <CardDescription className="text-slate-500">
                  High-value legal work requiring human judgment and expertise.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {humanTasks.map((task) => (
                    <div
                      key={task.title}
                      className="bg-slate-50/70 p-6 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center flex-shrink-0">
                          <task.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-2">
                            {task.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-3">
                            {task.description}
                          </p>
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                            {task.specialist}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90">
                    <Users className="w-4 h-4 mr-2" />
                    Assign Human Paralegal
                  </Button>
                  <Button variant="outline" className="flex-1 text-slate-700 border-slate-300">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Performance Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training">
            <Card className="bg-white shadow-lg border border-slate-200/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                  <BookOpen className="w-6 h-6" />
                  Training & Development Modules
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Continuous learning system for AI and human resources.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {trainingModules.map((module) => (
                  <div
                    key={module.title}
                    className="bg-slate-50/70 p-6 rounded-lg border border-slate-200"
                  >
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 text-lg mb-2">
                          {module.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3">
                          {module.description}
                        </p>
                        <Badge
                          className={`
                            ${module.type === "system"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : ""
                            }
                            ${module.type === "custom"
                              ? "bg-slate-200 text-slate-800 border-slate-300"
                              : ""
                            }
                            ${module.type === "templates"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : ""
                            }
                          `}
                        >
                          {module.status}
                        </Badge>
                      </div>
                      <div className="text-right flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        <div className="text-3xl font-bold text-indigo-600 mb-1">
                          {module.progress}%
                        </div>
                        <div className="w-full md:w-28 bg-slate-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-slate-200">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 w-full sm:w-auto"
                        disabled={module.progress === 100}
                      >
                        {module.progress === 100 ? (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {module.progress === 100
                          ? "Completed"
                          : "Continue Training"}
                      </Button>
                      <Button size="sm" variant="outline" className="text-slate-700 border-slate-300 w-full sm:w-auto">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
     </Layout>
  );
};

export default TrainYourResource;
