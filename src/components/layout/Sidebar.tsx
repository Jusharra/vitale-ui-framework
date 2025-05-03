
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Calendar,
  Home,
  MessageSquare,
  Pill,
  GraduationCap,
  Gift,
  Receipt,
  HelpCircle,
  Heart,
  CreditCard,
  User,
  Gauge,
  ClipboardList,
  Stethoscope,
  BadgeDollarSign,
  Video,
  Tag,
  Users,
  MapPin,
} from "lucide-react";
import MembershipBadge from "../common/MembershipBadge";

interface SidebarProps {
  role?: "member" | "professional" | "admin";
}

const Sidebar: React.FC<SidebarProps> = ({ role = "member" }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Determine if a menu item is active based on its path
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return path !== "/dashboard" && pathname.startsWith(path);
  };

  // Simplified mock membership type
  const membershipType: "smart" | "core" | "vip" = "smart";

  // Mock user data
  const userData = {
    name: "John Doe",
    role: role,
    email: "john.doe@example.com",
    membership: membershipType,
  };

  return (
    <SidebarPrimitive>
      <SidebarHeader>
        <div className="px-6 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground font-medium">
              {userData.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium leading-none">{userData.name}</h3>
              <p className="text-xs text-muted-foreground">{userData.email}</p>
            </div>
          </div>
          {role === "member" && <MembershipBadge type={userData.membership} />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Member Navigation */}
        {role === "member" && (
          <>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard"}
                    onClick={() => navigate("/dashboard")}
                  >
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/dashboard/appointments")}
                    onClick={() => navigate("/dashboard/appointments")}
                  >
                    <Calendar />
                    <span>Appointments</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/dashboard/concierge")}
                    onClick={() => navigate("/dashboard/concierge")}
                  >
                    <Users />
                    <span>My Concierge</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/dashboard/service-booking")}
                    onClick={() => navigate("/dashboard/service-booking")}
                  >
                    <Tag />
                    <span>Service Booking</span>
                    <div className="ml-auto">
                      <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-md">
                        10% Off
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/dashboard/health-tools")}
                    onClick={() => navigate("/dashboard/health-tools")}
                  >
                    <Heart />
                    <span>Health Tools</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/dashboard/messages")}
                    onClick={() => navigate("/dashboard/messages")}
                  >
                    <MessageSquare />
                    <span>Messages</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/dashboard/pharmacy")}
                    onClick={() => navigate("/dashboard/pharmacy")}
                  >
                    <Pill />
                    <span>Pharmacy</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/dashboard/telehealth")}
                    onClick={() => navigate("/dashboard/telehealth")}
                  >
                    <Video />
                    <span>Telehealth</span>
                    <div className="ml-auto">
                      <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-md">
                        VIP
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Benefits</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isActive("/dashboard/rewards")}
                      onClick={() => navigate("/dashboard/rewards")}
                    >
                      <Gift />
                      <span>Rewards</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isActive("/dashboard/promotions")}
                      onClick={() => navigate("/dashboard/promotions")}
                    >
                      <Receipt />
                      <span>Promotions</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isActive("/dashboard/membership")}
                      onClick={() => navigate("/dashboard/membership")}
                    >
                      <CreditCard />
                      <span>Membership</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Professional Navigation */}
        {role === "professional" && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/professional"}
                  onClick={() => navigate("/dashboard/professional")}
                >
                  <Gauge />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/professional/calendar")}
                  onClick={() => navigate("/dashboard/professional/calendar")}
                >
                  <Calendar />
                  <span>Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/professional/requests")}
                  onClick={() => navigate("/dashboard/professional/requests")}
                >
                  <ClipboardList />
                  <span>Patient Requests</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/professional/tools")}
                  onClick={() => navigate("/dashboard/professional/tools")}
                >
                  <Stethoscope />
                  <span>Tools of the Trade</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/professional/earnings")}
                  onClick={() => navigate("/dashboard/professional/earnings")}
                >
                  <BadgeDollarSign />
                  <span>Earnings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/professional/profile")}
                  onClick={() => navigate("/dashboard/professional/profile")}
                >
                  <User />
                  <span>Profile Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Admin Navigation */}
        {role === "admin" && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/admin"}
                  onClick={() => navigate("/dashboard/admin")}
                >
                  <Gauge />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Add admin navigation items here */}
            </SidebarMenu>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isActive("/dashboard/support")}
                onClick={() => navigate("/dashboard/support")}
              >
                <HelpCircle />
                <span>Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">
              {role === "member"
                ? "Manage Membership"
                : role === "professional"
                  ? "Manage Account"
                  : "Admin Settings"}
            </span>
          </Button>
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  );
};

export default Sidebar;
