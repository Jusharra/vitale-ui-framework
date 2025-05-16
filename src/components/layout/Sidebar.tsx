import React from "react";
import { NavLink } from 'react-router-dom';
import { CreditCard, LifeBuoy, DivideIcon as LucideIcon, MessageSquare, PanelLeft, Settings, Users, User, Calendar, Activity, Home, Map, Pill, ShoppingCart, Truck, Palmtree, Gift, Tag, BarChart2 as BarChart, Heart, Clipboard, BadgeDollarSign, Gauge, FileText, Download, Stethoscope } from 'lucide-react';
import { 
  Sidebar as SidebarContainer, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  role?: 'member' | 'professional' | 'admin' | 'partner';
}

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, children, className }) => {
  return (
    <SidebarMenuItem className={className}>
      <SidebarMenuButton asChild>
        <NavLink 
          to={to} 
          className={({ isActive }) => isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"}
        >
          <Icon className="h-5 w-5 mr-3" />
          {children}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ role = 'member' }) => {
  const { signOut } = useAuth();

  const renderMemberLinks = () => (
    <>
      <SidebarLink to="/dashboard" icon={Home}>Dashboard</SidebarLink>
      <SidebarLink to="/dashboard/health-insights" icon={Activity}>Health Insights</SidebarLink>
      <SidebarLink to="/dashboard/appointments" icon={Calendar}>Appointments</SidebarLink>
      <SidebarLink to="/dashboard/concierge" icon={Users}>My Care Team</SidebarLink>
      <SidebarLink to="/dashboard/pharmacy" icon={Pill}>Pharmacy</SidebarLink>
      <SidebarLink to="/dashboard/medical-transport" icon={Truck}>Medical Transport</SidebarLink>
      <SidebarLink to="/dashboard/service-booking" icon={ShoppingCart}>Services</SidebarLink>
      <SidebarLink to="/dashboard/vacations" icon={Palmtree}>Vacations</SidebarLink>
      <SidebarLink to="/dashboard/share-and-earn" icon={Gift}>Share & Earn</SidebarLink>
      <SidebarLink to="/dashboard/promotions" icon={Tag}>Promotions</SidebarLink>
      <SidebarLink to="/dashboard/messages" icon={MessageSquare}>Messages</SidebarLink>
      <SidebarLink to="/dashboard/membership" icon={CreditCard}>Membership</SidebarLink>
      <SidebarLink to="/dashboard/health-tools" icon={Heart}>Health Tools</SidebarLink>
    </>
  );

  const renderProfessionalLinks = () => (
    <>
      <SidebarLink to="/dashboard/professional" icon={Gauge}>Dashboard</SidebarLink>
      <SidebarLink to="/dashboard/professional/calendar" icon={Calendar}>Calendar</SidebarLink>
      <SidebarLink to="/dashboard/professional/requests" icon={Clipboard}>Patient Requests</SidebarLink>
      <SidebarLink to="/dashboard/professional/member-manager" icon={Users}>Member Manager</SidebarLink>
      <SidebarLink to="/dashboard/professional/message-center" icon={MessageSquare}>Message Center</SidebarLink>
      <SidebarLink to="/dashboard/professional/tools" icon={Stethoscope}>Tools of the Trade</SidebarLink>
      <SidebarLink to="/dashboard/professional/earnings" icon={BadgeDollarSign}>Earnings</SidebarLink>
      <SidebarLink to="/dashboard/professional/profile" icon={User}>Profile Settings</SidebarLink>
      <SidebarLink to="/dashboard/professional/analytics" icon={BarChart}>Analytics</SidebarLink>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <SidebarLink to="/dashboard/admin" icon={Gauge}>Overview</SidebarLink>
      <SidebarLink to="/dashboard/admin/vacations" icon={Palmtree}>Vacations</SidebarLink>
      <SidebarLink to="/dashboard/admin/promotions" icon={Gift}>Promotions</SidebarLink>
      <SidebarLink to="/dashboard/admin/leads" icon={BarChart}>Leads & Analytics</SidebarLink>
      <SidebarLink to="/dashboard/admin/care-teams" icon={Users}>Care Teams</SidebarLink>
      <SidebarLink to="/dashboard/admin/health-tools" icon={Heart}>Health Tools</SidebarLink>
      <SidebarLink to="/dashboard/admin/reports" icon={FileText}>Reports</SidebarLink>
      <SidebarLink to="/dashboard/admin/settings" icon={Settings}>System Settings</SidebarLink>
    </>
  );

  return (
    <SidebarContainer>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-semibold text-lg text-primary-foreground">V</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Vitale</h2>
            <p className="text-xs text-muted-foreground">Health Concierge</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {role === 'member' && renderMemberLinks()}
          {(role === 'professional' || role === 'partner') && renderProfessionalLinks()}
          {role === 'admin' && renderAdminLinks()}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-2">
          <SidebarLink to="/dashboard/support" icon={LifeBuoy}>Support</SidebarLink>
          <SidebarTrigger>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <PanelLeft className="h-4 w-4 mr-2" />
              Toggle Sidebar
            </Button>
          </SidebarTrigger>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            size="sm"
            onClick={signOut}
          >
            <User className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;