import { useState } from "react";
import { 
  LayoutDashboard, Briefcase, GraduationCap, Package, Shield, CreditCard, 
  Settings, Plus, Search, Bell, Users, Calendar, User2
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
  { title: "Dashboard", url: "/", icon: LayoutDashboard, badge: null },
  { title: "Cases", url: "/cases", icon: Briefcase, badge: "12" },
  { title: "Paralegal Training", url: "/training", icon: GraduationCap, badge: "3" },
  { title: "My Paralegals", url: "/myparalegals", icon: GraduationCap, badge: "3" },
  { title: "Service Bundles", url: "/services", icon: Package, badge: null },
  { title: "Compliance & Reports", url: "/compliance", icon: Shield, badge: "2" },
  { title: "Billing", url: "/billing", icon: CreditCard, badge: null },
  { title: "Profile", url: "/profile", icon: User2, badge: null },
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
    return path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={cn(
        "flex flex-col border-r bg-white shadow-lg transition-all duration-300",
        isCollapsed ? "w-20 max-w-[80px]" : "w-72 max-w-[288px]"
      )}
      collapsible="icon"
    >
      {/* Sidebar Header */}
      <SidebarHeader className="border-b p-4 flex items-start justify-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-300 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
          J
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-800">JurisLPO</h1>
            <span className="text-sm text-gray-500">Legal Dashboard</span>
          </div>
        )}
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex-1 p-2 overflow-y-auto">
        {!isCollapsed && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                        "flex items-center gap-3 px-3 py-6 rounded-lg transition-all duration-200",
                        isCollapsed ? "justify-center" : "justify-start",
                        isActive(item.url)
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive(item.url) ? "text-blue-600" : "text-gray-400")} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant={isActive(item.url) ? "secondary" : "outline"}
                              className="h-5 text-xs"
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
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex flex-col gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 justify-start px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.title}
                  </Button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t p-3 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 transition-all duration-200",
                  isCollapsed ? "justify-center" : "justify-start",
                  isActive("/settings") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                )}
              >
                <Settings className="w-5 h-5" />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!isCollapsed && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-200 rounded-full">
              <Bell className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">3 New Notifications</p>
              <p className="text-gray-500">Review pending drafts</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
