
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  FileText, 
  Prescription, 
  User 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock data
const prescriptionRefills = [
  { 
    id: 1, 
    patient: "Michael Wilson", 
    medication: "Lisinopril 10mg", 
    lastFilled: "2025-04-10",
    details: "30-day supply, 1 tablet daily",
    urgency: "high",
    dateRequested: "2025-05-02",
    notes: "Patient reports good tolerance and improved blood pressure readings"
  },
  { 
    id: 2, 
    patient: "Sarah Brown", 
    medication: "Metformin 500mg", 
    lastFilled: "2025-04-15",
    details: "90-day supply, 1 tablet twice daily",
    urgency: "medium",
    dateRequested: "2025-05-01",
    notes: "Patient moved from 250mg to 500mg last month, reports no side effects"
  },
  { 
    id: 3, 
    patient: "Robert Johnson", 
    medication: "Atorvastatin 20mg", 
    lastFilled: "2025-03-20",
    details: "30-day supply, 1 tablet at bedtime",
    urgency: "low",
    dateRequested: "2025-04-29",
    notes: "Routine refill, no changes needed"
  }
];

const symptomAlerts = [
  {
    id: 1,
    patient: "Emma Davis",
    symptoms: "Persistent headache for 3 days",
    severity: "moderate",
    vitals: { bp: "135/85", temp: "99.1°F", pulse: "88", o2: "97%" },
    dateReported: "2025-05-03",
    additionalInfo: "Pain is primarily on right side of head, over-the-counter pain relievers providing minimal relief"
  },
  {
    id: 2,
    patient: "James Wilson",
    symptoms: "Chest discomfort and shortness of breath",
    severity: "high",
    vitals: { bp: "145/90", temp: "98.6°F", pulse: "96", o2: "94%" },
    dateReported: "2025-05-02",
    additionalInfo: "Patient has history of hypertension. Symptoms worsen with physical activity."
  },
  {
    id: 3,
    patient: "Olivia Miller",
    symptoms: "Skin rash and itching",
    severity: "low",
    vitals: { bp: "120/80", temp: "98.4°F", pulse: "72", o2: "99%" },
    dateReported: "2025-05-01",
    additionalInfo: "Rash appeared yesterday, primarily on arms and torso. No known new exposures or medication changes."
  }
];

type RequestType = "refill" | "symptom";

const PatientRequestsList: React.FC = () => {
  const [selectedRefillId, setSelectedRefillId] = useState<number | null>(null);
  const [selectedSymptomId, setSelectedSymptomId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentRequestType, setCurrentRequestType] = useState<RequestType | null>(null);
  const { toast } = useToast();

  const handleOpenRequestDialog = (id: number, type: RequestType) => {
    if (type === "refill") {
      setSelectedRefillId(id);
    } else {
      setSelectedSymptomId(id);
    }
    setCurrentRequestType(type);
    setResponseText("");
    setDialogOpen(true);
  };

  const handleSubmitResponse = () => {
    // In a real app, this would send the response to the backend
    toast({
      title: "Response submitted",
      description: "Your response has been sent to the patient",
    });
    setDialogOpen(false);
    setResponseText("");
    setSelectedRefillId(null);
    setSelectedSymptomId(null);
  };

  const getSelectedRequest = () => {
    if (currentRequestType === "refill" && selectedRefillId) {
      return prescriptionRefills.find(request => request.id === selectedRefillId);
    } else if (currentRequestType === "symptom" && selectedSymptomId) {
      return symptomAlerts.find(alert => alert.id === selectedSymptomId);
    }
    return null;
  };

  const selectedRequest = getSelectedRequest();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="prescription-refills" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="prescription-refills">Prescription Refills</TabsTrigger>
          <TabsTrigger value="symptom-alerts">Symptom Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescription-refills" className="space-y-4">
          {prescriptionRefills.map((request) => (
            <Card key={request.id} className={`${request.urgency === 'high' ? 'border-red-500' : request.urgency === 'medium' ? 'border-amber-500' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`bg-muted w-10 h-10 rounded-full flex items-center justify-center ${request.urgency === 'high' ? 'bg-red-100' : request.urgency === 'medium' ? 'bg-amber-100' : ''}`}>
                      <Prescription className={`h-5 w-5 ${request.urgency === 'high' ? 'text-red-500' : request.urgency === 'medium' ? 'text-amber-500' : 'text-primary'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{request.patient}</CardTitle>
                      <CardDescription>Requested on {new Date(request.dateRequested).toLocaleDateString()}</CardDescription>
                    </div>
                  </div>
                  {request.urgency === 'high' && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Urgent</span>
                  )}
                  {request.urgency === 'medium' && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Priority</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Medication:</span> 
                    <span className="text-sm">{request.medication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Filled:</span>
                    <span className="text-sm">{new Date(request.lastFilled).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Details:</span>
                    <span className="text-sm">{request.details}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleOpenRequestDialog(request.id, "refill")} className="w-full">
                  Review Request
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="symptom-alerts" className="space-y-4">
          {symptomAlerts.map((alert) => (
            <Card key={alert.id} className={`${alert.severity === 'high' ? 'border-red-500' : alert.severity === 'moderate' ? 'border-amber-500' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`bg-muted w-10 h-10 rounded-full flex items-center justify-center ${alert.severity === 'high' ? 'bg-red-100' : alert.severity === 'moderate' ? 'bg-amber-100' : ''}`}>
                      <AlertTriangle className={`h-5 w-5 ${alert.severity === 'high' ? 'text-red-500' : alert.severity === 'moderate' ? 'text-amber-500' : 'text-primary'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{alert.patient}</CardTitle>
                      <CardDescription>Reported on {new Date(alert.dateReported).toLocaleDateString()}</CardDescription>
                    </div>
                  </div>
                  {alert.severity === 'high' && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Critical</span>
                  )}
                  {alert.severity === 'moderate' && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Moderate</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Reported Symptoms:</p>
                  <p className="text-sm bg-muted p-2 rounded">{alert.symptoms}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div className="bg-background border rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">BP</p>
                      <p className="text-sm font-medium">{alert.vitals.bp}</p>
                    </div>
                    <div className="bg-background border rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">Temp</p>
                      <p className="text-sm font-medium">{alert.vitals.temp}</p>
                    </div>
                    <div className="bg-background border rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">Pulse</p>
                      <p className="text-sm font-medium">{alert.vitals.pulse}</p>
                    </div>
                    <div className="bg-background border rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">O₂ Sat</p>
                      <p className="text-sm font-medium">{alert.vitals.o2}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleOpenRequestDialog(alert.id, "symptom")} className="w-full">
                  Respond to Alert
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Dialog for responding to requests */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentRequestType === "refill" ? "Prescription Refill Request" : "Patient Symptom Alert"}
            </DialogTitle>
            <DialogDescription>
              Review details and provide your response
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {selectedRequest.patient}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentRequestType === "refill" 
                      ? `Requested: ${new Date((selectedRequest as typeof prescriptionRefills[0]).dateRequested).toLocaleDateString()}`
                      : `Reported: ${new Date((selectedRequest as typeof symptomAlerts[0]).dateReported).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                {currentRequestType === "refill" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Medication</Label>
                        <p className="text-sm font-medium">{(selectedRequest as typeof prescriptionRefills[0]).medication}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Last Filled</Label>
                        <p className="text-sm font-medium">{new Date((selectedRequest as typeof prescriptionRefills[0]).lastFilled).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Details</Label>
                      <p className="text-sm font-medium">{(selectedRequest as typeof prescriptionRefills[0]).details}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Notes</Label>
                      <p className="text-sm">{(selectedRequest as typeof prescriptionRefills[0]).notes}</p>
                    </div>
                  </>
                )}

                {currentRequestType === "symptom" && (
                  <>
                    <div>
                      <Label className="text-xs">Reported Symptoms</Label>
                      <p className="text-sm font-medium">{(selectedRequest as typeof symptomAlerts[0]).symptoms}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-background border rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">BP</p>
                        <p className="text-sm font-medium">{(selectedRequest as typeof symptomAlerts[0]).vitals.bp}</p>
                      </div>
                      <div className="bg-background border rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="text-sm font-medium">{(selectedRequest as typeof symptomAlerts[0]).vitals.temp}</p>
                      </div>
                      <div className="bg-background border rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">Pulse</p>
                        <p className="text-sm font-medium">{(selectedRequest as typeof symptomAlerts[0]).vitals.pulse}</p>
                      </div>
                      <div className="bg-background border rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">O₂ Sat</p>
                        <p className="text-sm font-medium">{(selectedRequest as typeof symptomAlerts[0]).vitals.o2}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Additional Information</Label>
                      <p className="text-sm">{(selectedRequest as typeof symptomAlerts[0]).additionalInfo}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea 
                  id="response" 
                  value={responseText} 
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={currentRequestType === "refill" 
                    ? "Enter your decision and any instructions for the patient..." 
                    : "Provide your clinical feedback and recommendations..."
                  }
                  rows={5}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="text-xs">Response Options</Label>
                <div className="flex flex-wrap gap-2">
                  {currentRequestType === "refill" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setResponseText("Refill approved. The prescription will be sent to your pharmacy within 24 hours.")}
                      >
                        Approve Refill
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setResponseText("Refill denied. Please schedule an appointment for a check-up before we can renew this prescription.")}
                      >
                        Deny & Request Visit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setResponseText("I've approved a partial refill of 14 days. Please schedule an appointment for a follow-up within this period.")}
                      >
                        Partial Refill
                      </Button>
                    </>
                  )}
                  {currentRequestType === "symptom" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setResponseText("Based on your symptoms, I recommend you come in for an in-person evaluation. Please schedule an appointment at your earliest convenience.")}
                      >
                        Request Office Visit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setResponseText("Let's schedule a virtual appointment to discuss your symptoms in more detail. I have availability tomorrow.")}
                      >
                        Suggest Telehealth
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setResponseText("Your symptoms require immediate medical attention. Please go to the nearest emergency room or urgent care facility.")}
                        className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                      >
                        Urgent Care Needed
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmitResponse} 
              disabled={responseText.trim().length === 0}
            >
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientRequestsList;
