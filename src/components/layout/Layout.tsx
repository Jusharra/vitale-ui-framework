
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  role?: "member" | "professional" | "admin";
}

const Layout: React.FC<LayoutProps> = ({ children, role = "member" }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col">
          <Navbar role={role} />
          <main className="flex-1 overflow-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
