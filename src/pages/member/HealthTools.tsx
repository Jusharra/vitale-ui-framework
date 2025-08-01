
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import FeatureCard from '@/components/common/FeatureCard';
import { useAuth } from '@/context/AuthContext';
import { useAccessCheck } from '@/hooks/useToolAccess';
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess } = useAccessCheck(user?.id || null, 'premium_health_tools');

  // Navigation handlers for each tool
  const handleToolClick = (toolName: string) => {
    console.log('HealthTools: handleToolClick called with:', toolName);
    
    try {
      switch (toolName) {
        case 'symptom_checker':
        case 'virtual_consultation':
        case 'specialist_referral':
          console.log('HealthTools: Navigating to appointments');
          navigate('/dashboard/appointments');
          break;
        case 'health_assessment':
        case 'risk_calculator':
        case 'vital_signs':
        case 'health_insights':
          console.log('HealthTools: Navigating to health-insights');
          navigate('/dashboard/health-insights');
          break;
        case 'concierge':
          console.log('HealthTools: Navigating to concierge');
          navigate('/dashboard/concierge');
          break;
        case 'medication_tracker':
          console.log('HealthTools: Navigating to pharmacy');
          navigate('/dashboard/pharmacy');
          break;
        default:
          console.log('HealthTools: Unknown tool name:', toolName);
          break;
      }
    } catch (error) {
      console.error('HealthTools: Error in handleToolClick:', error);
    }
  };

  const handleUpgradeClick = () => {
    console.log('HealthTools: handleUpgradeClick called');
    try {
      navigate('/dashboard/membership');
    } catch (error) {
      console.error('HealthTools: Error in handleUpgradeClick:', error);
    }
  };

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
                onClick={() => handleToolClick('symptom_checker')}
              />
              <FeatureCard
                title="Health Assessment"
                description="Complete a comprehensive health assessment"
                icon={CircleCheck}
                onClick={() => handleToolClick('health_assessment')}
              />
              <FeatureCard
                title="Risk Calculator"
                description="Calculate your risk for common conditions"
                icon={Heart}
                locked={!hasAccess}
                requiresUpgrade="core"
                onClick={hasAccess ? () => handleToolClick('risk_calculator') : handleUpgradeClick}
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
                onClick={() => handleToolClick('virtual_consultation')}
              />
              <FeatureCard
                title="Specialist Referral"
                description="Get referred to the right specialist quickly"
                icon={CirclePlus}
                locked={!hasAccess}
                requiresUpgrade="core"
                onClick={hasAccess ? () => handleToolClick('specialist_referral') : handleUpgradeClick}
              />
              <FeatureCard
                title="24/7 Concierge Access"
                description="On-demand access to healthcare concierge"
                icon={Calendar}
                locked={!hasAccess}
                requiresUpgrade="core"
                onClick={hasAccess ? () => handleToolClick('concierge') : handleUpgradeClick}
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
                onClick={() => handleToolClick('medication_tracker')}
              />
              <FeatureCard
                title="Vital Signs Log"
                description="Record and monitor important vital signs"
                icon={HeartPulse}
                locked={!hasAccess}
                requiresUpgrade="core"
                onClick={hasAccess ? () => handleToolClick('vital_signs') : handleUpgradeClick}
              />
              <FeatureCard
                title="Health Insights"
                description="Get AI-powered insights on your health data"
                icon={Heart}
                onClick={() => handleToolClick('health_insights')}
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
                locked={!hasAccess}
                requiresUpgrade="core"
                onClick={hasAccess ? () => handleToolClick('risk_calculator') : handleUpgradeClick}
              />
              <FeatureCard
                title="Specialist Referral"
                description="Get referred to the right specialist quickly"
                icon={CirclePlus}
                locked={!hasAccess}
                requiresUpgrade="core"
                onClick={hasAccess ? () => handleToolClick('specialist_referral') : handleUpgradeClick}
              />
              <FeatureCard
                title="24/7 Concierge Access"
                description="On-demand access to healthcare concierge"
                icon={Calendar}
                locked={!hasAccess}
                requiresUpgrade="core"
                onClick={hasAccess ? () => handleToolClick('concierge') : handleUpgradeClick}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default HealthTools;
