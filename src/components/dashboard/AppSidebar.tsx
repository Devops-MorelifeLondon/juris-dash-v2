import { useEffect, useState, useCallback } from "react";
import { 
  LayoutDashboard, Briefcase, GraduationCap, Package, Shield, CreditCard, 
  Settings, Plus, Search, Bell, Users, Calendar, User2, LogOut, X, CheckCircle, RefreshCw
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { clearAttorney } from "@/store/attorneySlice";
import { persistor } from "@/store/store";
import { apiClient } from "@/lib/api/config";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, badge: null },
  { title: "Cases", url: "/cases", icon: Briefcase, badge: "12" },
  { title: "Tasks", url: "/tasks", icon: Briefcase, badge: "12" },
  { title: "Paralegal Training", url: "/training", icon: GraduationCap, badge: "3" },
  { title: "My Paralegals", url: "/myparalegals", icon: GraduationCap, badge: "3" },
  { title: "Service Bundles", url: "/services", icon: Package, badge: null },
  { title: "Compliance & Reports", url: "/compliance", icon: Shield, badge: "2" },
  { title: "Billing", url: "/billing", icon: CreditCard, badge: null },
  { title: "Profile", url: "/profile", icon: User2, badge: null },
];

const quickActions = [
  { title: "New Case", icon: Plus, action: "/cases" },
  { title: "Assign Task", icon: Users, action: "assign-task" },
  { title: "Schedule Meeting", icon: Calendar, action: "schedule" },
];

interface Notification {
  _id: string;
  recipient: string;
  recipientModel: string;
  type: string;
  task?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    return path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    dispatch(clearAttorney());
    persistor.purge();
    navigate("/auth");
  };

  // Memoized fetch function to avoid recreating on every render
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get('/api/notifications');
      
      if (response.data.success) {
        setNotifications(response.data.data || []);
        // Set error state if returned from API
        if (response.data.error) {
          setError(response.data.message);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch notifications');
      }
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      setError(error.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await apiClient.patch(`/api/notifications/${notificationId}/read`);
      
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true, updatedAt: new Date().toISOString() }
              : notif
          )
        );
        
        // Show success feedback (optional toast notification here)
        console.log('Notification marked as read:', response.data.message);
      } else {
        throw new Error(response.data.message || 'Failed to mark as read');
      }
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
      setError(error.response?.data?.message || 'Failed to mark as read');
      
      // Revert optimistic update on error
      await fetchNotifications();
    }
  }, [fetchNotifications]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
  }, [fetchNotifications]);

  // Initial load and periodic refresh
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Refresh when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchNotifications();
    }
  }, [isModalOpen, fetchNotifications]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata' // IST timezone
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null); // Clear error when closing modal
  };

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
                      <item.icon
                        className={cn(
                          "w-5 h-5",
                          isActive(item.url) ? "text-blue-600" : "text-gray-400"
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && !isCollapsed && (
                            <Badge variant="secondary" className="text-xs">
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
                  <Link
                    key={action.title}
                    to={action.action}
                    className="flex items-center gap-2 justify-start px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.title}
                  </Link>
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
                  isActive("/settings")
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                )}
              >
                <Settings className="w-5 h-5" />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 transition-all duration-200 w-full",
                  isCollapsed ? "justify-center" : "justify-start",
                  "hover:bg-red-50"
                )}
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!isCollapsed && (
          <>
            <div 
              className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-600 flex items-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-200 rounded-full">
                <Bell className="w-4 h-4" />
              </div>
              <div className="text-sm flex-1 min-w-0">
                <p className="font-semibold truncate" title={unreadCount > 0 ? `${unreadCount} New Notification${unreadCount > 1 ? 's' : ''}` : 'No New Notifications'}>
                  {unreadCount > 0 ? `${unreadCount} New Notification${unreadCount > 1 ? 's' : ''}` : 'No New Notifications'}
                </p>
                <p className="text-gray-500 text-xs">Click to view all</p>
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-600 border-red-200 h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto p-0 sm:max-w-lg">
                <DialogHeader className="p-6 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg font-semibold">Notifications</DialogTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCw 
                          className={cn("h-4 w-4", isRefreshing ? "animate-spin" : "")} 
                        />
                      </Button>
                   
                    </div>
                  </div>
                  {error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setError(null)}
                        className="mt-1 h-4 px-1 text-xs"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    {unreadCount} unread • {notifications.length} total
                  </p>
                </DialogHeader>
                
                <div className="p-0">
                  <div className="p-6 max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center py-12 flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                        <p className="text-gray-500">Loading notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p>No notifications available</p>
                        <p className="text-sm text-gray-400">You'll see updates here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={cn(
                              "p-4 rounded-lg border transition-all duration-200 hover:shadow-sm",
                              !notification.isRead
                                ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-2">
                                  {!notification.isRead && (
                                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                  )}
                                  <p className="text-sm font-medium text-gray-900 flex-1 min-w-0 pr-2">
                                    {notification.message}
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2 text-gray-500">
                                    <span>{formatDate(notification.createdAt)}</span>
                                    {notification.type && (
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                        {notification.type.replace('_', ' ').toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* {notification.task && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      asChild
                                      className="h-5 p-0 text-xs text-blue-600 hover:text-blue-700"
                                    >
                                      <Link to={`/tasks/${notification.task}`}>
                                        View Task
                                      </Link>
                                    </Button>
                                  )} */}
                                </div>
                              </div>
                              
                              {!notification.isRead && (
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification._id);
                                    }}
                                    className="h-7 px-2 text-xs bg-blue-100 hover:bg-blue-200"
                                    disabled={isLoading}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Mark Read
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-4 border-t bg-gray-50">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                      >
                        <RefreshCw 
                          className={cn("h-4 w-4 mr-2", isRefreshing ? "animate-spin" : "")} 
                        />
                        {isRefreshing ? 'Refreshing...' : 'Refresh Notifications'}
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
