
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  Home,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  User,
  Users,
  LayoutDashboard,
  ListCheck,
  Folder,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import MembershipBadge from "../common/MembershipBadge";

interface SidebarProps {
  role?: "member" | "professional" | "admin";
}

const Sidebar: React.FC<SidebarProps> = ({ role = "member" }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Mock current user data
  const mockUser = {
    name: "John Doe",
    membership: role === "member" ? "smart" : undefined,
  };

  const memberItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Appointments", icon: Calendar, path: "/dashboard/appointments" },
    { title: "Smart Health Tools", icon: LayoutDashboard, path: "/dashboard/health-tools" },
    { title: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
    { title: "Pharmacy", icon: FileText, path: "/dashboard/pharmacy" },
    { title: "Share & Rewards", icon: Users, path: "/dashboard/rewards" },
    { title: "Promotions", icon: Folder, path: "/dashboard/promotions" },
    { title: "Membership", icon: User, path: "/dashboard/membership" },
    { title: "Support", icon: HelpCircle, path: "/dashboard/support" },
  ];

  const professionalItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard/professional" },
    { title: "Patient Requests", icon: ListCheck, path: "/dashboard/professional/requests" },
    { title: "Calendar", icon: Calendar, path: "/dashboard/professional/calendar" },
    { title: "Earnings", icon: FileText, path: "/dashboard/professional/earnings" },
    { title: "Profile Settings", icon: Settings, path: "/dashboard/professional/profile" },
  ];

  const adminItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard/admin" },
    { title: "Users", icon: Users, path: "/dashboard/admin/users" },
    { title: "Professionals", icon: User, path: "/dashboard/admin/professionals" },
    { title: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
  ];

  const items = 
    role === "professional" ? professionalItems : 
    role === "admin" ? adminItems : 
    memberItems;

  const roleLabel = 
    role === "professional" ? "Professional Portal" : 
    role === "admin" ? "Admin Portal" : 
    "Member Portal";

  return (
    <SidebarComponent>
      <SidebarHeader className="py-6 px-3">
        <div className="flex justify-center mb-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
              <span className="text-primary-foreground text-lg font-bold">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Vitale</span>
          </Link>
        </div>
        {role === "member" && mockUser.membership && (
          <div className="flex justify-center mt-2">
            <MembershipBadge type={mockUser.membership as "smart" | "core" | "vip"} />
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    currentPath === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}>
                    <Link to={item.path}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
