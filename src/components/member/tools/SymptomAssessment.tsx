
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AIAssistant from "@/components/ai/AIAssistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SymptomData {
  description: string;
  severity: number;
  duration: string;
  onset_date?: Date;
  notes?: string;
}

const SymptomAssessment: React.FC = () => {
  const [step, setStep] = useState<'ai_chat' | 'form' | 'submitting' | 'results'>('ai_chat');
  const [symptomData, setSymptomData] = useState<SymptomData>({
    description: '',
    severity: 3,
    duration: 'hours',
    notes: '',
  });
  const [aiAssessment, setAiAssessment] = useState<{
    urgency: 'Low' | 'Medium' | 'High';
    recommendation: string;
    next_steps: string[];
  } | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Handle AI Assistant actions
  const handleAiAction = (action: string, data: any) => {
    if (action === 'symptom_detected') {
      // Pre-populate symptom form with AI detected data
      setSymptomData(prev => ({
        ...prev,
        description: data.symptom || prev.description
      }));
      setStep('form');
    }
  };

  // Update symptom data
  const updateSymptomData = (field: keyof SymptomData, value: any) => {
    setSymptomData(prev => ({ ...prev, [field]: value }));
  };

  // Submit symptoms for assessment
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit symptoms",
        variant: "destructive"
      });
      return;
    }

    setStep('submitting');

    try {
      // Submit to Supabase
      const { data, error } = await supabase.from('symptom_submissions').insert({
        profile_id: user.id,
        symptoms: symptomData.description,
        severity: symptomData.severity,
        duration: symptomData.duration,
        onset_date: symptomData.onset_date,
        notes: symptomData.notes,
        status: 'Submitted',
        urgency_flag: symptomData.severity > 7 ? 'High' : symptomData.severity > 4 ? 'Medium' : 'Low'
      }).select();

      if (error) throw error;
      
      // In a real implementation, you'd call your AI assessment service or Make.com integration here
      // Simulating AI assessment
      setTimeout(() => {
        // Mock AI assessment based on severity
        const mockAssessment = {
          urgency: symptomData.severity > 7 ? 'High' : symptomData.severity > 4 ? 'Medium' : 'Low' as 'Low' | 'Medium' | 'High',
          recommendation: symptomData.severity > 7 
            ? "Seek immediate medical attention" 
            : symptomData.severity > 4 
              ? "Schedule a telehealth appointment within 24 hours" 
              : "Monitor symptoms and use self-care measures",
          next_steps: symptomData.severity > 7 
            ? ["Visit the nearest emergency room", "Contact your healthcare provider"] 
            : symptomData.severity > 4 
              ? ["Schedule a telehealth appointment", "Take over-the-counter medication as appropriate"] 
              : ["Rest and stay hydrated", "Use over-the-counter medication as appropriate", "Contact healthcare provider if symptoms worsen"]
        };
        
        setAiAssessment(mockAssessment);
        setStep('results');
        
        // In a real implementation, you'd update the symptom_submissions record with the AI assessment
      }, 2000);
      
      toast({
        title: "Symptoms Submitted",
        description: "Your symptoms have been submitted for assessment",
      });
      
    } catch (error) {
      console.error("Error submitting symptoms:", error);
      toast({
        title: "Error",
        description: "Failed to submit symptoms. Please try again.",
        variant: "destructive"
      });
      setStep('form');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'High': return 'text-red-500 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const handleScheduleAppointment = () => {
    toast({
      title: "Appointment Scheduling",
      description: "This would redirect to the appointment booking page with pre-filled symptoms.",
    });
    // In a real implementation, you'd redirect to the appointment page with pre-filled data
  };

  return (
    <div className="space-y-6">
      {step === 'ai_chat' && (
        <Card>
          <CardHeader>
            <CardTitle>Symptom Assessment</CardTitle>
            <CardDescription>Tell our AI assistant about your symptoms or complete the form directly</CardDescription>
          </CardHeader>
          <CardContent>
            <AIAssistant 
              title="Symptom Assessment"
              description="Describe your symptoms, and I'll help analyze them"
              contextType="symptom"
              initialMessage="Hello! Please describe the symptoms you're experiencing, and I'll help assess them. For example, you could say 'I have a headache and feel dizzy.'"
              onAction={handleAiAction}
            />
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setStep('form')}
            >
              Skip to form
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {step === 'form' && (
        <Card>
          <CardHeader>
            <CardTitle>Symptom Details</CardTitle>
            <CardDescription>Please provide information about your symptoms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptom-description">Describe your symptoms</Label>
              <Textarea 
                id="symptom-description"
                placeholder="E.g., Headache, fever, sore throat, etc."
                value={symptomData.description}
                onChange={(e) => updateSymptomData('description', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptom-severity">
                Severity (1-10): {symptomData.severity}
              </Label>
              <Slider 
                id="symptom-severity"
                min={1} 
                max={10} 
                step={1}
                value={[symptomData.severity]}
                onValueChange={([value]) => updateSymptomData('severity', value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptom-duration">How long have you had these symptoms?</Label>
              <Select 
                value={symptomData.duration} 
                onValueChange={(value) => updateSymptomData('duration', value)}
              >
                <SelectTrigger id="symptom-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptom-notes">Additional notes (optional)</Label>
              <Textarea 
                id="symptom-notes"
                placeholder="Any additional information that might be helpful..."
                value={symptomData.notes || ''}
                onChange={(e) => updateSymptomData('notes', e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full"
              onClick={handleSubmit}
              disabled={!symptomData.description}
            >
              Submit for assessment
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setStep('ai_chat')}
            >
              Back to AI chat
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {step === 'submitting' && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Analyzing your symptoms...</p>
            <p className="text-sm text-muted-foreground">
              Our AI is assessing your symptoms and determining next steps
            </p>
          </CardContent>
        </Card>
      )}
      
      {step === 'results' && aiAssessment && (
        <Card>
          <CardHeader>
            <CardTitle>AI Assessment Results</CardTitle>
            <CardDescription>Based on the symptoms you provided</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 border rounded-lg ${getUrgencyColor(aiAssessment.urgency)}`}>
              <div className="flex items-center gap-2">
                {aiAssessment.urgency === 'High' ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : aiAssessment.urgency === 'Low' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                <p className="font-medium">Urgency: {aiAssessment.urgency}</p>
              </div>
              <p className="mt-2">{aiAssessment.recommendation}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Next Steps</h3>
              <ul className="space-y-2">
                {aiAssessment.next_steps.map((step, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {aiAssessment.urgency !== 'Low' && (
              <Button className="w-full" onClick={handleScheduleAppointment}>
                Schedule appointment now
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={() => setStep('ai_chat')}>
              Start new assessment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SymptomAssessment;
