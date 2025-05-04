
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Calendar, Phone, Star, Users, MapPin, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import useToolAccess from "@/hooks/useToolAccess";
import { Skeleton } from "@/components/ui/skeleton";

interface Provider {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  practice_name?: string;
  specialties?: string[];
  bio?: string;
  accepting_new_patients: boolean;
  telehealth_enabled: boolean;
  profile_image?: string;
  rating?: number;
  doxy_room_url?: string;
}

const TelehealthProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();
  const { hasAccess } = useToolAccess('telehealth');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        if (!profile) return;
        
        // Fetch providers that are part of the member's care team
        const { data, error } = await supabase
          .from('care_team_members')
          .select(`
            partner:partner_id (
              id, name, email, phone, practice_name, specialties, 
              bio, accepting_new_patients, telehealth_enabled, profile_image, rating, doxy_room_url
            )
          `)
          .eq('profile_id', profile.id)
          .eq('partners.telehealth_enabled', true);
        
        if (error) throw error;
        
        // Filter and transform the data
        const filteredProviders = data
          ?.map(item => item.partner as Provider)
          .filter(Boolean) || [];
        
        setProviders(filteredProviders);
      } catch (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your telehealth providers',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [profile]);

  const handleScheduleTelehealth = (providerId: string) => {
    // Navigate to scheduling page with provider pre-selected
    console.log('Schedule telehealth with provider:', providerId);
    toast({
      title: 'Scheduling',
      description: 'Redirecting to appointment scheduling',
    });
    // In a real implementation, this would navigate to the appointment booking page
  };

  if (isLoading) {
    return <ProvidersLoadingSkeleton />;
  }

  if (!hasAccess) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <CardTitle>Premium Feature: Telehealth</CardTitle>
          <CardDescription>
            Video consultations with healthcare providers are available to VIP members only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upgrade to VIP Executive</h3>
            <p className="text-muted-foreground mb-4">
              Get access to on-demand telehealth consultations with your healthcare providers.
            </p>
            <Button>Upgrade Membership</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (providers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telehealth Providers</CardTitle>
          <CardDescription>
            You don't have any telehealth-enabled providers in your care team yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Add providers to your care team</h3>
            <p className="text-muted-foreground mb-4">
              Visit your concierge page to add healthcare providers to your team.
            </p>
            <Button>Go to Concierge Team</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={provider.profile_image} alt={provider.name} />
                    <AvatarFallback>{provider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{provider.name}</CardTitle>
                    <CardDescription>{provider.practice_name || "Independent Provider"}</CardDescription>
                  </div>
                </div>
                {provider.telehealth_enabled && (
                  <Badge className="bg-primary/20 text-primary">Telehealth Ready</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {provider.specialties && provider.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {provider.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="rounded-sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
              
              {provider.bio && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{provider.bio}</p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>{provider.rating || "Not rated"}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2 grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleScheduleTelehealth(provider.id)}
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={() => window.open(provider.doxy_room_url, '_blank')}
                disabled={!provider.doxy_room_url}
              >
                <Video className="h-4 w-4" />
                <span>Start Video</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProvidersLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2].map(i => (
      <Card key={i}>
        <CardHeader className="pb-2">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2 space-y-3">
          <div className="flex gap-1">
            <Skeleton className="h-5 w-16 rounded-sm" />
            <Skeleton className="h-5 w-16 rounded-sm" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter className="pt-2 grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default TelehealthProviders;
