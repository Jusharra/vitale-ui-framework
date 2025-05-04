
import React, { useEffect, useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Calendar, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Changed to match what we're using in the component
  type: string;
  partner_id: string;
  service_id: string;
  start_date: string;
  expires_at: string;
  tier_eligibility: 'smart' | 'core' | 'vip' | 'all';
  redemption_limit: number;
  redemptions_used: number;
  reward_amount: number;
  created_at: string;
}

const MemberPromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { membershipTier } = useAuth();
  
  useEffect(() => {
    // Simulate loading promotions from API
    const mockPromotions: Promotion[] = [
      {
        id: '1',
        title: 'Premium Health Insurance Discount',
        description: 'Get 15% off on premium health insurance plans from our trusted partners.',
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        type: 'insurance',
        partner_id: '123',
        service_id: '456',
        start_date: '2025-04-01',
        expires_at: '2025-06-30',
        tier_eligibility: 'all',
        redemption_limit: 100,
        redemptions_used: 45,
        reward_amount: 15,
        created_at: '2025-03-15'
      },
      {
        id: '2',
        title: 'Exclusive Resort Package',
        description: 'Enjoy a 3-night stay at a luxury resort with 20% discount on all spa treatments.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        type: 'vacation',
        partner_id: '789',
        service_id: '012',
        start_date: '2025-05-01',
        expires_at: '2025-08-31',
        tier_eligibility: 'vip',
        redemption_limit: 50,
        redemptions_used: 12,
        reward_amount: 20,
        created_at: '2025-04-01'
      },
      {
        id: '3',
        title: 'Telehealth Consultation',
        description: 'Free first-time telehealth consultation with specialized doctors.',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        type: 'telehealth',
        partner_id: '345',
        service_id: '678',
        start_date: '2025-04-15',
        expires_at: '2025-07-15',
        tier_eligibility: 'core',
        redemption_limit: 200,
        redemptions_used: 78,
        reward_amount: 100,
        created_at: '2025-03-30'
      },
      {
        id: '4',
        title: 'Mental Wellness Package',
        description: 'Three free therapy sessions with certified mental health professionals.',
        imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        type: 'wellness',
        partner_id: '901',
        service_id: '234',
        start_date: '2025-04-01',
        expires_at: '2025-09-30',
        tier_eligibility: 'all',
        redemption_limit: 150,
        redemptions_used: 67,
        reward_amount: 250,
        created_at: '2025-03-25'
      }
    ];
    
    setPromotions(mockPromotions);
  }, []);

  const handleClaimOffer = (promotion: Promotion) => {
    // Check if user's tier is eligible
    if (
      promotion.tier_eligibility !== 'all' && 
      membershipTier !== promotion.tier_eligibility && 
      !(promotion.tier_eligibility === 'core' && membershipTier === 'vip')
    ) {
      toast({
        title: "Upgrade Required",
        description: `This offer requires a ${promotion.tier_eligibility} membership or higher.`,
        variant: "destructive"
      });
      return;
    }

    // Simulate claiming the offer
    toast({
      title: "Offer Claimed!",
      description: "Check your email for details on how to redeem this promotion.",
    });

    // Could log to API here for tracking
  };

  const filteredPromotions = activeTab === 'all' 
    ? promotions 
    : promotions.filter(p => p.type === activeTab);

  // A function to check if user can claim based on their tier
  const canClaimPromotion = (tierEligibility: 'smart' | 'core' | 'vip' | 'all') => {
    if (tierEligibility === 'all') return true;
    if (!membershipTier) return false;
    
    const tierValues = { smart: 1, core: 2, vip: 3 };
    const userTierValue = tierValues[membershipTier];
    const requiredTierValue = tierValues[tierEligibility];
    
    return userTierValue >= requiredTierValue;
  };

  return (
    <MemberPageLayout 
      title="Exclusive Promotions" 
      description="Special offers and deals exclusively for Vitale members"
    >
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="telehealth">Telehealth</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="vacation">Vacation</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promotion) => (
                <Card key={promotion.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={promotion.imageUrl} 
                      alt={promotion.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{promotion.title}</CardTitle>
                      <Badge variant={canClaimPromotion(promotion.tier_eligibility) ? "default" : "outline"}>
                        {promotion.tier_eligibility === 'all' ? 'All Members' : `${promotion.tier_eligibility} tier+`}
                      </Badge>
                    </div>
                    <CardDescription>{promotion.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Expires: {new Date(promotion.expires_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                    <Button 
                      onClick={() => handleClaimOffer(promotion)}
                      disabled={!canClaimPromotion(promotion.tier_eligibility)}
                    >
                      <Gift className="mr-2 h-4 w-4" /> 
                      Claim Offer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-10 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Gift className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No Promotions Available</h3>
                <p className="text-muted-foreground">
                  Check back later for new offers and promotions.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default MemberPromotionsPage;
