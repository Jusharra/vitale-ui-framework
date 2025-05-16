import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  Menu,
  MessageSquare,
  Search,
  Settings,
  User,
  Globe
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSelector from "@/components/i18n/LanguageSelector";
import { useTranslation } from "@/utils/i18n";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  role?: "member" | "professional" | "admin" | "partner";
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  role = "member",
  onToggleSidebar,
  isMobile
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // Mock data
  const notifications = 3;
  const messages = 2;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardPath = () => {
    switch(role) {
      case 'admin':
        return '/dashboard/admin';
      case 'professional':
      case 'partner':
        return '/dashboard/professional';
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="md:hidden mr-2">
          <SidebarTrigger onClick={onToggleSidebar}>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
        </div>
        
        <div className="flex items-center md:gap-2 lg:gap-4">
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold">
              {role === "professional" || role === "partner" ? t('navigation.professionalPortal') : 
               role === "admin" ? t('navigation.adminPortal') : 
               t('navigation.healthConcierge')}
            </h1>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="search"
              placeholder={t('actions.search')}
              className="flex h-9 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          <LanguageSelector variant="compact" className="mr-2" />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center rounded-full">
                {notifications}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            {messages > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center rounded-full">
                {messages}
              </span>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('user.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">{t('user.profile')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">{t('user.settings')}</Link>
              </DropdownMenuItem>
              {role === "member" && (
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/membership">{t('user.membership')}</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to={getDashboardPath()}>Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                {t('auth.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden md:flex gap-1">
                <span>{t('navigation.help')}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/support">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>{t('navigation.support')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/faq">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>{t('navigation.faq')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('navigation.contact')}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;