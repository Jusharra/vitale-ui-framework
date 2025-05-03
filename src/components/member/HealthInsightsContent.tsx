
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { AlertTriangle, Heart, Activity, Thermometer, Weight, Bell, Pill, Brain, FileText, ChevronRight, Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Mock data for health insights
const vitalSigns = [
  { id: 1, name: "Blood Pressure", value: "120/80 mmHg", status: "normal", date: "April 28, 2025" },
  { id: 2, name: "Heart Rate", value: "72 bpm", status: "normal", date: "April 28, 2025" },
  { id: 3, name: "Blood Glucose", value: "98 mg/dL", status: "normal", date: "April 25, 2025" },
  { id: 4, name: "Oxygen Saturation", value: "98%", status: "normal", date: "April 28, 2025" },
];

const weightData = [
  { id: 1, date: "April 28, 2025", weight: "175 lbs" },
  { id: 2, date: "March 28, 2025", weight: "178 lbs" },
  { id: 3, date: "February 28, 2025", weight: "180 lbs" },
];

const allergyData = [
  { id: 1, name: "Peanuts", severity: "High", symptoms: "Anaphylaxis" },
  { id: 2, name: "Dust", severity: "Medium", symptoms: "Sneezing, Itchy eyes" },
  { id: 3, name: "Penicillin", severity: "Medium", symptoms: "Rash" },
];

const mentalHealthData = [
  { id: 1, date: "April 15, 2025", assessment: "Depression Screening", score: "3/27", interpretation: "Minimal symptoms" },
  { id: 2, date: "April 15, 2025", assessment: "Anxiety Screening", score: "5/21", interpretation: "Mild anxiety" },
];

const treatmentPlans = [
  { 
    id: 1, 
    condition: "Hypertension Management", 
    provider: "Dr. Sarah Johnson",
    lastUpdated: "April 10, 2025",
    recommendations: [
      "Maintain blood pressure below 130/80 mmHg",
      "Daily 30-minute moderate exercise",
      "DASH diet with reduced sodium intake"
    ]
  },
  { 
    id: 2, 
    condition: "Seasonal Allergies", 
    provider: "Dr. Michael Chen",
    lastUpdated: "March 15, 2025",
    recommendations: [
      "Daily antihistamine during spring months",
      "HEPA air purifier in bedroom",
      "Weekly cleaning to reduce dust accumulation"
    ]
  },
];

const assessments = [
  { id: 1, name: "General Wellness Assessment", duration: "5 min", completed: true },
  { id: 2, name: "Mental Health Screening", duration: "10 min", completed: true },
  { id: 3, name: "Heart Health Risk Assessment", duration: "8 min", completed: false },
  { id: 4, name: "Sleep Quality Assessment", duration: "6 min", completed: false }
];

const HealthInsightsContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vitals");
  
  const form = useForm({
    defaultValues: {
      alertBloodPressure: true,
      alertGlucose: true,
      alertMedication: false,
      alertAppointments: true,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // This would save the alert preferences to the backend
  };

  const handleStartAssessment = (assessmentId: number) => {
    // In a real app, this would navigate to the assessment
    console.log(`Starting assessment ${assessmentId}`);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
          <TabsTrigger value="insights">Health Insights</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="treatments">Treatment Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("vitals")}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Track your important health metrics</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("weight")}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Weight className="h-5 w-5 mr-2 text-primary" />
                  Weight Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Monitor your weight trends</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("allergies")}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Review your allergy information</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("mental")}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  Mental Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Track your mental wellness</p>
              </CardContent>
            </Card>
          </div>

          {activeTab === "vitals" && (
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
                <CardDescription>Your recent health measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vitalSigns.map((vital) => (
                    <div key={vital.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{vital.name}</p>
                        <p className="text-sm text-muted-foreground">Measured: {vital.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{vital.value}</p>
                        <p className={`text-sm ${
                          vital.status === "normal" ? "text-green-600" : 
                          vital.status === "high" ? "text-amber-600" : "text-red-600"
                        }`}>
                          {vital.status.charAt(0).toUpperCase() + vital.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View History</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "weight" && (
            <Card>
              <CardHeader>
                <CardTitle>Weight Management</CardTitle>
                <CardDescription>Track your weight trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weightData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">Weight</p>
                        <p className="text-sm text-muted-foreground">Recorded: {item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.weight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Record New Weight</Button>
                <Button variant="outline">View Trends</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "allergies" && (
            <Card>
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
                <CardDescription>Important allergy information to share with providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allergyData.map((allergy) => (
                    <div key={allergy.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{allergy.name}</p>
                        <p className="text-sm text-muted-foreground">Symptoms: {allergy.symptoms}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          allergy.severity === "High" ? "bg-red-100 text-red-800" : 
                          allergy.severity === "Medium" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                        }`}>
                          {allergy.severity} Severity
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Update Allergies</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "mental" && (
            <Card>
              <CardHeader>
                <CardTitle>Mental Health Insights</CardTitle>
                <CardDescription>Results from your mental health assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentalHealthData.map((item) => (
                    <div key={item.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{item.assessment}</p>
                          <p className="text-sm text-muted-foreground">Completed: {item.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.score}</p>
                        </div>
                      </div>
                      <p className="text-sm">{item.interpretation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Complete New Assessment</Button>
                <Button variant="outline">View Resources</Button>
              </CardFooter>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Health Alerts</CardTitle>
              <CardDescription>Customize what health notifications you receive</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="alertBloodPressure"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Blood Pressure Alerts</FormLabel>
                          <FormDescription>
                            Receive alerts when blood pressure readings are outside normal range
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alertGlucose"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Glucose Level Alerts</FormLabel>
                          <FormDescription>
                            Receive alerts for abnormal glucose readings
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alertMedication"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Medication Reminders</FormLabel>
                          <FormDescription>
                            Get reminders to take your prescribed medications
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alertAppointments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Appointment Reminders</FormLabel>
                          <FormDescription>
                            Receive reminders about upcoming appointments
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Alert Preferences</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Assessments</CardTitle>
              <CardDescription>Complete these assessments to get personalized health recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{assessment.name}</p>
                      <p className="text-sm text-muted-foreground">Duration: {assessment.duration}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {assessment.completed && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">
                          Completed
                        </span>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStartAssessment(assessment.id)}
                      >
                        {assessment.completed ? "Retake" : "Start"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>Review your past assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Mental Health Screening</p>
                    <p className="text-sm text-muted-foreground">Completed: April 15, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">View Results</Button>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">General Wellness Assessment</p>
                    <p className="text-sm text-muted-foreground">Completed: April 1, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">View Results</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plans</CardTitle>
              <CardDescription>Current treatment plans from your healthcare team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {treatmentPlans.map((plan) => (
                  <div key={plan.id} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">{plan.condition}</h3>
                        <p className="text-sm text-muted-foreground">Provider: {plan.provider}</p>
                        <p className="text-sm text-muted-foreground">Last updated: {plan.lastUpdated}</p>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {plan.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate('/dashboard/appointments')}
                className="w-full"
              >
                Schedule Appointment with Provider
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Treatment Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Hypertension Check-in</p>
                    <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">May 10, 2025 at 10:30 AM</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/appointments')}>
                    View Details
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allergy Management Review</p>
                    <p className="text-sm text-muted-foreground">Dr. Michael Chen</p>
                    <p className="text-sm text-muted-foreground">June 5, 2025 at 2:00 PM</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/appointments')}>
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthInsightsContent;
