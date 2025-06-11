import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SimplePlacementForm from './SimplePlacementForm';

interface PlacementRequestButtonProps extends ButtonProps {
  facilityId?: string;
  facilityName?: string;
  professionalId?: string;
  professionalName?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const PlacementRequestButton: React.FC<PlacementRequestButtonProps> = ({
  facilityId,
  facilityName,
  professionalId,
  professionalName,
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          {...props}
        >
          {children || "Request Placement"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Placement</DialogTitle>
        </DialogHeader>
        <SimplePlacementForm 
          facilityId={facilityId}
          facilityName={facilityName}
          professionalId={professionalId}
          professionalName={professionalName}
          onSuccess={() => {
            // Close the dialog after a short delay to allow the success message to be seen
            setTimeout(() => {
              setIsDialogOpen(false);
            }, 3000);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PlacementRequestButton;