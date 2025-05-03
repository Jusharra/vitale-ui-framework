
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import FeatureCard from '@/components/common/FeatureCard';
import { 
  Calendar, 
  Heart, 
  MessageSquare, 
  Pill, 
  HeartPulse, 
  Thermometer,
  CircleCheck,
  CirclePlus
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HealthTools = () => {
  return (
    <MemberPageLayout 
      title="Smart Health Tools" 
      description="Access digital healthcare tools to manage your health"
    >
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="upgraded">Premium</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Health Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                title="Symptom Checker"
                description="Check your symptoms and get recommendations"
                icon={Thermometer}
              />
              <FeatureCard
                title="Health Assessment"
                description="Complete a comprehensive health assessment"
                icon={CircleCheck}
              />
              <FeatureCard
                title="Risk Calculator"
                description="Calculate your risk for common conditions"
                icon={Heart}
                locked
                requiresUpgrade="core"
              />
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Consultations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                title="Virtual Consultation"
                description="Connect with a healthcare provider via video"
                icon={MessageSquare}
              />
              <FeatureCard
                title="Specialist Referral"
                description="Get referred to the right specialist quickly"
                icon={CirclePlus}
                locked
                requiresUpgrade="core"
              />
              <FeatureCard
                title="24/7 Concierge Access"
                description="On-demand access to healthcare concierge"
                icon={Calendar}
                locked
                requiresUpgrade="vip"
              />
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Monitoring & Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                title="Medication Tracker"
                description="Track and manage your medications"
                icon={Pill}
              />
              <FeatureCard
                title="Vital Signs Log"
                description="Record and monitor important vital signs"
                icon={HeartPulse}
              />
              <FeatureCard
                title="Health Insights"
                description="Get AI-powered insights on your health data"
                icon={Heart}
                locked
                requiresUpgrade="core"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-6">
          <div className="mt-6 text-center p-8">
            <p className="text-muted-foreground">You haven't added any favorite tools yet.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="upgraded" className="space-y-6">
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Upgrade Your Membership</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                title="Risk Calculator"
                description="Calculate your risk for common conditions"
                icon={Heart}
                locked
                requiresUpgrade="core"
              />
              <FeatureCard
                title="Specialist Referral"
                description="Get referred to the right specialist quickly"
                icon={CirclePlus}
                locked
                requiresUpgrade="core"
              />
              <FeatureCard
                title="24/7 Concierge Access"
                description="On-demand access to healthcare concierge"
                icon={Calendar}
                locked
                requiresUpgrade="vip"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default HealthTools;
