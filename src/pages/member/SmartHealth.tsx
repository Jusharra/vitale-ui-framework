
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymptomAssessment from '@/components/member/tools/SymptomAssessment';
import AIAssistant from '@/components/ai/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleCheck, Heart, HeartPulse, MessageSquare, Pill, ThermometerSun } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useAccessCheck } from '@/hooks/useToolAccess';

const SmartHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('symptom-checker');
  const { user } = useAuth();
  
  const handleAIAction = (action: string, data: any) => {
    console.log('AI Action:', action, data);
    // Handle AI-triggered actions here, like changing tabs or pre-filling forms
    if (action === 'appointment_intent') {
      // Would navigate to appointments page in a full implementation
    }
  };

  return (
    <MemberPageLayout
      title="Smart Health"
      description="AI-powered health tools and assessments"
    >
      <div className="mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Welcome to Smart Health</CardTitle>
                <CardDescription>AI-powered tools to manage your health</CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                AI-Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <p className="mb-4">
                Our intelligent health tools can help you assess symptoms, track vital signs, manage medications, 
                and provide personalized health insights based on your data.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Symptom Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Health Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Medication Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm">AI Health Insights</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <AIAssistant 
                title="Health Assistant" 
                description="Ask me about our health tools"
                initialMessage="Hello! I'm your AI health assistant. How can I help you today? You can ask me about our tools or get started with a symptom assessment."
                onAction={handleAIAction}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="symptom-checker" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
          <TabsTrigger value="symptom-checker" className="flex gap-2 items-center">
            <ThermometerSun className="h-4 w-4" />
            <span className="hidden md:inline">Symptom Checker</span>
            <span className="md:hidden">Symptoms</span>
          </TabsTrigger>
          
          <TabsTrigger value="vital-tracker" className="flex gap-2 items-center">
            <HeartPulse className="h-4 w-4" />
            <span className="hidden md:inline">Vital Tracker</span>
            <span className="md:hidden">Vitals</span>
          </TabsTrigger>
          
          <TabsTrigger value="medication" className="flex gap-2 items-center">
            <Pill className="h-4 w-4" />
            <span className="hidden md:inline">Medication Manager</span>
            <span className="md:hidden">Meds</span>
          </TabsTrigger>
          
          <TabsTrigger value="health-insights" className="flex gap-2 items-center">
            <Heart className="h-4 w-4" />
            <span className="hidden md:inline">Health Insights</span>
            <span className="md:hidden">Insights</span>
          </TabsTrigger>
          
          <TabsTrigger value="chat" className="flex gap-2 items-center">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">AI Chat</span>
            <span className="md:hidden">Chat</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="symptom-checker">
            <SymptomAssessment />
          </TabsContent>
          
          <TabsContent value="vital-tracker">
            <Card>
              <CardHeader>
                <CardTitle>Vital Sign Tracker</CardTitle>
                <CardDescription>Track and monitor your vital signs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The vital sign tracker would be implemented here, allowing users to log and monitor health metrics like blood pressure, heart rate, temperature, etc.
                </p>
              </CardContent>
              <CardFooter>
                <Button disabled>Coming Soon</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="medication">
            <Card>
              <CardHeader>
                <CardTitle>Medication Manager</CardTitle>
                <CardDescription>Track and manage your medications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The medication manager would be implemented here, allowing users to track prescriptions, set reminders, and request refills.
                </p>
              </CardContent>
              <CardFooter>
                <Button disabled>Coming Soon</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="health-insights">
            <Card>
              <CardHeader>
                <CardTitle>Health Insights</CardTitle>
                <CardDescription>AI-powered insights based on your health data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The health insights tool would be implemented here, providing personalized AI analysis of health trends and patterns.
                </p>
              </CardContent>
              <CardFooter>
                <Button disabled>Coming Soon</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat">
            <AIAssistant 
              title="Health Assistant" 
              description="Get answers to your health questions"
              initialMessage="I'm here to discuss any health concerns you might have. While I can provide general information, always consult with a healthcare professional for personalized medical advice."
              isFloating={false}
              onAction={handleAIAction}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Floating assistant is only shown on non-chat tabs */}
      {activeTab !== 'chat' && (
        <div className="fixed bottom-6 right-6">
          <AIAssistant isFloating={true} onAction={handleAIAction} />
        </div>
      )}
    </MemberPageLayout>
  );
};

export default SmartHealth;
