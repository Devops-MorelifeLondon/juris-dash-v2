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
        {/* 
          On medium screens and up (md:), this div will be part of the flex layout.
          On smaller screens, it will be hidden. Your SidebarProvider should
          handle showing it as a drawer.
        */}
        <div className="hidden md:block">
            <AppSidebar />
        </div>
        
        <main className={cn("flex-1 overflow-auto", className)}>
          <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 lg:px-6">
              {/* This trigger is now ONLY visible on screens smaller than md */}
              <SidebarTrigger className="mr-4 md:hidden" />
              <div className="flex-1" />
              {/* Header content will be added here */}
            </div>
          </header>
          
          {/* 
            On smaller screens, we reduce the padding to give more space.
            The left padding is increased on larger screens to account for the sidebar.
          */}
          <div className="flex-1  overflow-y-auto md:pl-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
