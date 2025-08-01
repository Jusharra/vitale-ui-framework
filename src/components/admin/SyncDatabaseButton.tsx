import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SyncDatabaseButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-all-subscriptions');
      
      if (error) {
        throw error;
      }

      const result = data;
      toast({
        title: "Sync Completed",
        description: `Successfully synced ${result.synced} profiles. Total profiles: ${result.totalProfiles}`,
      });

      if (result.errors && result.errors > 0) {
        toast({
          title: "Sync Warning",
          description: `${result.errors} profiles had errors during sync. Check logs for details.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Database Synchronization</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Force sync all user subscription data from Stripe to the local database. This will update membership tiers and subscription statuses.
        </p>
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          variant="outline"
          className="w-fit"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Syncing...' : 'Force Sync Database'}
        </Button>
      </div>
    </div>
  );
};

export default SyncDatabaseButton;