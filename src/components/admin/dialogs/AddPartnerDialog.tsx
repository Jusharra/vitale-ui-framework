
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { defaultPartnerFormValues } from './partners/schema';
import PartnerForm from './partners/PartnerForm';
import { usePartnerSubmission } from './partners/usePartnerSubmission';

interface AddPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddPartnerDialog = ({ open, onOpenChange, onSuccess }: AddPartnerDialogProps) => {
  const { handleSubmit } = usePartnerSubmission(onSuccess, () => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Healthcare Professional</DialogTitle>
          <DialogDescription>Create a new healthcare partner profile</DialogDescription>
        </DialogHeader>
        <PartnerForm 
          defaultValues={defaultPartnerFormValues}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPartnerDialog;
