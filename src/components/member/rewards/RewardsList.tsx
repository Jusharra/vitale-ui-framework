
// Fixing the error in this file by updating the function call with correct parameters

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/utils/currencyUtils';
import { Badge } from '@/components/ui/badge';

const RewardsList = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const { data, error } = await supabase
          .from('member_rewards')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setRewards(data || []);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRewards();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-10">Loading rewards...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rewards.length > 0 ? (
        rewards.map((reward) => (
          <Card key={reward.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{reward.name}</CardTitle>
                  <CardDescription className="mt-1">{reward.description}</CardDescription>
                </div>
                <Badge variant="outline">{reward.reward_type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-medium">{formatPrice(reward.value)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">{new Date(reward.expires_at).toLocaleDateString()}</span>
                </div>
                <Button className="w-full mt-4" variant="default">Claim Reward</Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">No rewards available right now</p>
        </div>
      )}
    </div>
  );
};

export default RewardsList;
