import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Package,
  CreditCard,
  Bell,
  User2,
  LogOut,
  CheckCircle,
  RefreshCw,
  MessageCircleIcon,
  Calendar1Icon,
  Activity,
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
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { clearAttorney } from "@/store/attorneySlice";
import { persistor } from "@/store/store";
import { apiClient } from "@/lib/api/config";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Cases", url: "/cases", icon: Briefcase },
  { title: "Tasks", url: "/tasks", icon: Briefcase },
  { title: "Chat", url: "/chat", icon: MessageCircleIcon },
  { title: "Meetings", url: "/meetings", icon: Calendar1Icon },
  { title: "Upload Training", url: "/training", icon: GraduationCap },
  { title: "Monitor Training", url: "/documents/attorney-training", icon: Activity }, // <-- New Route
  { title: "My Paralegals", url: "/myparalegals", icon: GraduationCap },
  { title: "Service Bundles", url: "/services", icon: Package },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Profile", url: "/profile", icon: User2 },
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
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    dispatch(clearAttorney());
    persistor.purge();
    navigate("/auth");
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get("/api/notifications");

      if (response.data.success) {
        setNotifications(response.data.data || []);
        if (response.data.error) {
          setError(response.data.message);
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch notifications");
      }
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      setError(error.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await apiClient.patch(
          `/api/notifications/${notificationId}/read`
        );
        if (response.data.success) {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === notificationId
                ? { ...notif, isRead: true, updatedAt: new Date().toISOString() }
                : notif
            )
          );
        } else {
          throw new Error(response.data.message || "Failed to mark as read");
        }
      } catch (error: any) {
        console.error("Failed to mark notification as read:", error);
        setError(error.response?.data?.message || "Failed to mark as read");
        await fetchNotifications();
      }
    },
    [fetchNotifications]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (isModalOpen) {
      fetchNotifications();
    }
  }, [isModalOpen, fetchNotifications]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      setError(null);
    }
  };

  return (
    <Sidebar
      className={cn(
        "flex h-screen flex-col border-r bg-white shadow-sm",
        "w-64 max-w-[256px]" // Reduced width for a more compact feel
      )}
    >
      {/* Sidebar Header - LOGO */}
      <SidebarHeader className="border-b p-4 flex items-center justify-start h-16">
        {/* === REPLACE WITH YOUR LOGO ===
          - Update the `src` to point to your logo image.
          - The `h-8` (32px) is a recommended height. Adjust as needed.
        */}
        <img
          src="/logo.png" // <-- IMPORTANT: Change this path
          alt="JurisLPO Logo"
          className="h-10 w-auto" // Adjust height as needed
        />
        {/* // Fallback placeholder if you don't have a logo file yet:
        <div className="h-8 w-32 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-500">
          Your Logo
        </div> 
        */}
      </SidebarHeader>

      {/* Sidebar Content - Navigation */}
      <SidebarContent className="flex-1 p-2">
        {" "}
        {/* Removed overflow-y-auto */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 justify-start text-sm",
                        isActive(item.url)
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0", // Icons are fixed size
                          isActive(item.url)
                            ? "text-blue-600"
                            : "text-gray-400"
                        )}
                      />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="text-xs h-5 px-1.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer - Logout & Notifications */}
      <SidebarFooter className="border-t p-2 mt-auto">
        {/* Notification Block */}
        <div
          className="mt-2 p-2.5 bg-gray-50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-200 rounded-full">
            <Bell className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-sm flex-1 min-w-0">
            <p
              className="font-medium text-gray-800 truncate"
              title={
                unreadCount > 0
                  ? `${unreadCount} New Notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "No New Notifications"
              }
            >
              {unreadCount > 0
                ? `${unreadCount} New Notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "Notifications"}
            </p>
            <p className="text-gray-500 text-xs">
              {unreadCount > 0 ? "Click to view" : "No new updates"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          )}
        </div>

        <SidebarMenu className="mt-2">
          {/* Logout Button */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 w-full justify-start",
                  "text-gray-600 hover:bg-red-50 hover:text-red-600"
                )}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto p-0 sm:max-w-lg">
            <DialogHeader className="p-6 border-b bg-gray-50 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">
                  Notifications
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw
                    className={cn(
                      "h-4 w-4",
                      isRefreshing ? "animate-spin" : ""
                    )}
                  />
                </Button>
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
                    <p className="text-sm text-gray-400">
                      You'll see updates here
                    </p>
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
                                    {notification.type
                                      .replace("_", " ")
                                      .toUpperCase()}
                                  </span>
                                )}
                              </div>
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
                <div className="p-4 border-t bg-gray-50 sticky bottom-0 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4 mr-2",
                        isRefreshing ? "animate-spin" : ""
                      )}
                    />
                    {isRefreshing ? "Refreshing..." : "Refresh Notifications"}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}