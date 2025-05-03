
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Pill, ThermometerSun } from 'lucide-react';
import MembershipBadge from '@/components/common/MembershipBadge';

// Mock data
const promotions = [
  {
    id: 1,
    title: "Annual Health Assessment",
    category: "health",
    description: "Comprehensive health check at 30% off regular price",
    validUntil: "June 30, 2025",
    requiredTier: "smart",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  },
  {
    id: 2,
    title: "Travel Medical Insurance",
    category: "travel",
    description: "Special rates on international travel medical coverage",
    validUntil: "December 31, 2025",
    requiredTier: "core",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: 3,
    title: "Premium Supplement Bundle",
    category: "wellness",
    description: "Curated vitamin and supplement package at member pricing",
    validUntil: "August 15, 2025",
    requiredTier: "smart",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    id: 4,
    title: "Executive Health Retreat",
    category: "wellness",
    description: "Exclusive weekend wellness retreat with health professionals",
    validUntil: "October 1, 2025",
    requiredTier: "vip",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    id: 5,
    title: "Medical Transportation Service",
    category: "travel",
    description: "Priority medical transport services worldwide",
    validUntil: "December 31, 2025",
    requiredTier: "vip",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  },
];

const Promotions = () => {
  const [activeTab, setActiveTab] = useState("all");
  const userMembership = "smart"; // Mock user membership

  // Filter promotions based on active tab and user's membership tier
  const filteredPromotions = promotions.filter(promo => {
    if (activeTab !== "all" && promo.category !== activeTab) return false;
    
    // Check membership tier access
    const tierLevels = { "smart": 1, "core": 2, "vip": 3 };
    const userLevel = tierLevels[userMembership];
    const requiredLevel = tierLevels[promo.requiredTier];
    
    return userLevel >= requiredLevel;
  });

  const lockedPromotions = promotions.filter(promo => {
    if (activeTab !== "all" && promo.category !== activeTab) return false;
    
    // Check membership tier access
    const tierLevels = { "smart": 1, "core": 2, "vip": 3 };
    const userLevel = tierLevels[userMembership];
    const requiredLevel = tierLevels[promo.requiredTier];
    
    return userLevel < requiredLevel;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case "health": 
        return <ThermometerSun className="h-5 w-5 text-primary" />;
      case "wellness": 
        return <Heart className="h-5 w-5 text-primary" />;
      case "travel":
      default: 
        return <Pill className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <MemberPageLayout 
      title="Promotions" 
      description="Exclusive health and wellness offers for members"
    >
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Available promotions */}
            {filteredPromotions.map((promo) => (
              <Card key={promo.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img 
                    src={promo.image} 
                    alt={promo.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1 rounded-md">
                        {getCategoryIcon(promo.category)}
                      </div>
                      <Badge>{promo.category}</Badge>
                    </div>
                    <MembershipBadge type={promo.requiredTier} size="sm" />
                  </div>
                  <CardTitle className="mt-2">{promo.title}</CardTitle>
                  <CardDescription>Valid until: {promo.validUntil}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-muted-foreground">{promo.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Offer</Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Locked promotions */}
            {lockedPromotions.map((promo) => (
              <Card key={promo.id} className="overflow-hidden flex flex-col bg-muted/30">
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  <img 
                    src={promo.image} 
                    alt={promo.title} 
                    className="w-full h-full object-cover filter grayscale opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/80 px-4 py-2 rounded-full">
                      <div className="flex items-center gap-2">
                        <MembershipBadge type={promo.requiredTier} size="sm" />
                        <span className="text-sm font-medium">Exclusive</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted p-1 rounded-md">
                        {getCategoryIcon(promo.category)}
                      </div>
                      <Badge variant="outline">{promo.category}</Badge>
                    </div>
                  </div>
                  <CardTitle className="mt-2">{promo.title}</CardTitle>
                  <CardDescription>Upgrade to unlock</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-muted-foreground">{promo.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Upgrade to {promo.requiredTier.charAt(0).toUpperCase() + promo.requiredTier.slice(1)}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredPromotions.length === 0 && lockedPromotions.length === 0 && (
            <div className="text-center p-10">
              <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No promotions available</h3>
              <p className="text-muted-foreground mb-4">
                There are currently no {activeTab === 'all' ? '' : activeTab + ' '}promotions available
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Promotions;
