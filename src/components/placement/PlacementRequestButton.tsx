import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import PlacementRequestFlow from './PlacementRequestFlow';

interface PlacementRequestButtonProps extends ButtonProps {
  facilityId?: string;
  facilityName?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const PlacementRequestButton: React.FC<PlacementRequestButtonProps> = ({
  facilityId,
  facilityName,
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
          onClick={() => setIsDialogOpen(true)}
          {...props}
        >
          {children || "Request Placement"}
        </Button>
      </DialogTrigger>
      
      <PlacementRequestFlow
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        facilityId={facilityId}
        facilityName={facilityName}
      />
    </Dialog>
  );
};

export default PlacementRequestButton;