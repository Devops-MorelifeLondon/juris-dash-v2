import { useState } from "react";
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Package, 
  Shield, 
  CreditCard, 
  Settings, 
  Plus,
  Search,
  Bell,
  Users,
  FileText,
  Calendar,
  TrendingUp
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    badge: null
  },
  { 
    title: "Cases", 
    url: "/cases", 
    icon: Briefcase,
    badge: "12"
  },
  { 
    title: "Paralegal Training", 
    url: "/training", 
    icon: GraduationCap,
    badge: "3"
  },
  { 
    title: "Service Bundles", 
    url: "/services", 
    icon: Package,
    badge: null
  },
  { 
    title: "Compliance & Reports", 
    url: "/compliance", 
    icon: Shield,
    badge: "2"
  },
  { 
    title: "Billing", 
    url: "/billing", 
    icon: CreditCard,
    badge: null
  },
];

const quickActions = [
  { title: "New Case", icon: Plus, action: "new-case" },
  { title: "Assign Task", icon: Users, action: "assign-task" },
  { title: "Schedule Meeting", icon: Calendar, action: "schedule" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      className={cn(
        "border-r bg-gradient-card shadow-elegant transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold text-sm">J</span>
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                JurisLPO
              </h1>
              <p className="text-xs text-muted-foreground">Legal Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {!isCollapsed && (
          <div className="mb-6 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
              />
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground shadow-card"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        isActive(item.url) ? "text-primary-foreground" : "text-muted-foreground"
                      )} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant={isActive(item.url) ? "secondary" : "outline"}
                              className="h-5 text-xs animate-pulse-glow"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 animate-fade-in">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 h-9 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-[1.02]"
                  >
                    <action.icon className="h-4 w-4" />
                    {action.title}
                  </Button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive("/settings")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Settings className="h-5 w-5 transition-transform group-hover:rotate-90" />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {!isCollapsed && (
          <div className="mt-4 p-3 bg-gradient-primary rounded-lg text-primary-foreground animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-medium">3 New Notifications</p>
                <p className="opacity-90">Review pending drafts</p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}