import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-muted">
        {/* Main Sidebar - hidden on small screens, visible on medium and up */}
        <div className="hidden md:flex md:flex-col md:w-64">
          <AppSidebar />
        </div>

        {/* Main content area */}
        <main className={cn("flex-1 flex flex-col overflow-auto", className)}>
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 lg:px-6">
              {/* Sidebar trigger visible only on small screens */}
              <SidebarTrigger className="mr-4 md:hidden" />

              {/* You can add other header content here, like a user profile button */}
            </div>
          </header>

          {/* Content area with its own scrolling */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
