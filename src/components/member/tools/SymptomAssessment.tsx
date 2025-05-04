
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const SymptomAssessment: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<string>('');
  const [severity, setSeverity] = useState<number>(5);
  const [duration, setDuration] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
  
  // Mapping for severity levels
  const getSeverityLabel = (value: number): string => {
    if (value <= 2) return "Mild";
    if (value <= 5) return "Moderate";
    if (value <= 8) return "Severe";
    return "Critical";
  };

  const getUrgencyFlag = (severityValue: number): string => {
    if (severityValue <= 3) return "Low";
    if (severityValue <= 6) return "Medium";
    return "High";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms) {
      toast({
        title: "Error",
        description: "Please describe your symptoms",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format date as YYYY-MM-DD for database
      const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;

      // Save to Supabase
      const { data, error } = await supabase.from('symptom_submissions').insert({
        symptoms,
        severity,
        duration,
        notes,
        onset_date: formattedDate,
        urgency_flag: getUrgencyFlag(severity),
        profile_id: user?.id,
        status: 'Submitted'
      });
      
      if (error) throw error;
      
      // Simulate AI assessment (in a real app, this would call an AI service)
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        
        // Generate a mock assessment based on severity
        const aiAssessment = simulateAIAssessment(symptoms, severity);
        setAssessmentResult(aiAssessment);
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting symptoms:", error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit your symptoms. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Simple mock AI assessment function
  const simulateAIAssessment = (symptoms: string, severityValue: number): string => {
    const severityText = getSeverityLabel(severityValue);
    
    if (severityValue >= 9) {
      return `Based on your description of "${symptoms}" with ${severityText} symptoms, this appears to be a CRITICAL condition that may require immediate medical attention. Please consider visiting an emergency room or calling for medical assistance right away.`;
    } else if (severityValue >= 7) {
      return `Your symptoms "${symptoms}" are rated as ${severityText}. We recommend consulting with a healthcare provider within 24 hours. Would you like to schedule a telehealth appointment?`;
    } else if (severityValue >= 4) {
      return `I've analyzed your ${severityText} symptoms: "${symptoms}". This may not be an emergency, but we recommend speaking with a healthcare provider soon. Consider a telehealth appointment in the next few days.`;
    } else {
      return `Your symptoms "${symptoms}" appear to be ${severityText}. Monitor your condition, stay hydrated, and rest. If symptoms persist for more than 3-5 days or worsen, consider booking an appointment.`;
    }
  };
  
  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Symptom Assessment Result</CardTitle>
          <CardDescription>AI-powered health assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <h3 className="font-medium mb-2">AI Assessment</h3>
            <p>{assessmentResult}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Symptom Details</h3>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severity:</span>
                <span className="font-medium">{getSeverityLabel(severity)} ({severity}/10)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{duration || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Onset Date:</span>
                <span className="font-medium">{date ? format(date, 'PPP') : "Not specified"}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full">
            Submit New Assessment
          </Button>
          <Button className="w-full">
            Schedule Appointment
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Assessment</CardTitle>
        <CardDescription>Tell us about your symptoms for an AI-powered assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe Your Symptoms</Label>
            <Textarea 
              id="symptoms" 
              placeholder="Please describe what you're experiencing..." 
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[100px]" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="severity">Severity ({severity}/10)</Label>
              <span className="text-sm text-muted-foreground">{getSeverityLabel(severity)}</span>
            </div>
            <Slider 
              id="severity"
              defaultValue={[5]} 
              max={10} 
              min={1} 
              step={1} 
              onValueChange={(values) => setSeverity(values[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
              <span>Critical</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <RadioGroup 
              id="duration" 
              value={duration} 
              onValueChange={setDuration} 
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Less than a day" id="r1" />
                <Label htmlFor="r1">Less than a day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-2 days" id="r2" />
                <Label htmlFor="r2">1-2 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-7 days" id="r3" />
                <Label htmlFor="r3">3-7 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-2 weeks" id="r4" />
                <Label htmlFor="r4">1-2 weeks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Over 2 weeks" id="r5" />
                <Label htmlFor="r5">Over 2 weeks</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="onset">When did it start?</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="onset"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Any other details you'd like to share..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]" 
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={isSubmitting || !symptoms}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Symptoms...
            </>
          ) : "Submit for Assessment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SymptomAssessment;
