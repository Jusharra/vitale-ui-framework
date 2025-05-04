
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Settings,
  UserCog,
  Shield,
  RefreshCw,
  AlertTriangle,
  MoreHorizontal
} from "lucide-react";
import { useAdminToolkit } from '@/hooks/useAdminStatus';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface AdminActionsMenuProps {
  userId?: string;
  userEmail?: string;
  variant?: 'default' | 'outline' | 'ghost';
  triggerIcon?: React.ReactNode;
}

const AdminActionsMenu: React.FC<AdminActionsMenuProps> = ({
  userId,
  userEmail,
  variant = 'outline',
  triggerIcon = <MoreHorizontal className="h-4 w-4" />
}) => {
  const { isAdmin, resetUserPassword } = useAdminToolkit();
  const { toast } = useToast();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const handleResetPassword = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is required to reset password",
        variant: "destructive",
      });
      return;
    }

    setIsResettingPassword(true);
    try {
      const success = await resetUserPassword(userId);
      if (success) {
        toast({
          title: "Password reset email sent",
          description: `A password reset email has been sent to ${userEmail || 'the user'}`,
        });
        setIsResetDialogOpen(false);
      } else {
        throw new Error("Failed to send reset email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size="sm">
            {triggerIcon}
            <span className="sr-only">Admin actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setIsResetDialogOpen(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Password
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <UserCog className="mr-2 h-4 w-4" />
            Edit User Profile
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Shield className="mr-2 h-4 w-4" />
            Change User Role
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Suspend User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              This will send a password reset email to {userEmail || 'the user'}.
              Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsResetDialogOpen(false)}
              disabled={isResettingPassword}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword} 
              disabled={isResettingPassword}
            >
              {isResettingPassword ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Email"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminActionsMenu;
