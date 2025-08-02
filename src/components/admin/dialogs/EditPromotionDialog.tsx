import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  reward_amount: z.number().min(0, 'Reward amount must be positive'),
  expires_at: z.string().min(1, 'Expiration date is required'),
  status: z.string().min(1, 'Status is required'),
  redemption_limit: z.number().min(1).optional(),
  redemptions_used: z.number().min(0).default(0),
  terms_conditions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditPromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  promotion: any;
}

const EditPromotionDialog: React.FC<EditPromotionDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  promotion,
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: promotion?.title || '',
      description: promotion?.description || '',
      type: promotion?.type || '',
      reward_amount: promotion?.reward_amount || 0,
      expires_at: promotion?.expires_at ? promotion.expires_at.split('T')[0] : '',
      status: promotion?.status || '',
      redemption_limit: promotion?.redemption_limit || undefined,
      redemptions_used: promotion?.redemptions_used || 0,
      terms_conditions: promotion?.terms_conditions || '',
    },
  });

  React.useEffect(() => {
    if (promotion && open) {
      form.reset({
        title: promotion.title || '',
        description: promotion.description || '',
        type: promotion.type || '',
        reward_amount: promotion.reward_amount || 0,
        expires_at: promotion.expires_at ? promotion.expires_at.split('T')[0] : '',
        status: promotion.status || '',
        redemption_limit: promotion.redemption_limit || undefined,
        redemptions_used: promotion.redemptions_used || 0,
        terms_conditions: promotion.terms_conditions || '',
      });
    }
  }, [promotion, open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({
          title: values.title,
          description: values.description,
          type: values.type,
          reward_amount: values.reward_amount,
          expires_at: values.expires_at,
          status: values.status,
          redemption_limit: values.redemption_limit || null,
          redemptions_used: values.redemptions_used,
          terms_conditions: values.terms_conditions,
        })
        .eq('id', promotion.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating promotion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update promotion',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Promotion</DialogTitle>
          <DialogDescription>
            Update the promotion details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter promotion title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter promotion description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., discount, cashback" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reward_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expires_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., active, expired" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="redemption_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redemption Limit (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Unlimited" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="redemptions_used"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redemptions Used</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="terms_conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms and Conditions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter terms and conditions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Promotion</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPromotionDialog;