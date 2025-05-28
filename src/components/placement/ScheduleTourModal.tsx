import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Clock, MapPin, CheckCircle, Loader2 } from 'lucide-react';

interface ScheduleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: {
    id: string;
    name: string;
    location: string;
    email?: string;
    phone?: string;
  };
}

const ScheduleTourModal: React.FC<ScheduleTourModalProps> = ({ isOpen, onClose, facility }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [tourType, setTourType] = useState("in-person");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate available time slots (9 AM to 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      const hourFormatted = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      
      slots.push(`${hourFormatted}:00 ${period}`);
      slots.push(`${hourFormatted}:30 ${period}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Reset form when modal closes
  const handleClose = () => {
    if (!isSubmitting) {
      setDate(undefined);
      setTime("");
      setNotes("");
      setTourType("in-person");
      setIsSubmitted(false);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for your tour",
        variant: "destructive"
      });
      return;
    }
    
    if (!name || !email || !phone) {
      toast({
        title: "Missing information",
        description: "Please provide your contact information",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the date and time for storage
      const formattedDate = format(date, 'yyyy-MM-dd');
      const tourDateTime = `${formattedDate}T${time.split(' ')[0]}:00${time.includes('PM') && !time.startsWith('12') ? '+12:00' : ''}`;
      
      // In a real implementation, this would save to a tours or appointments table
      // For now, we'll simulate a successful submission
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send email notification (in a real implementation)
      // This would call a serverless function to send emails to the facility and admin
      
      // Show success message
      toast({
        title: "Tour scheduled successfully",
        description: `Your tour at ${facility.name} has been scheduled for ${format(date, 'MMMM d, yyyy')} at ${time}`,
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error scheduling tour:", error);
      toast({
        title: "Error",
        description: "There was a problem scheduling your tour. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule a Tour at {facility.name}</DialogTitle>
          <DialogDescription>
            Select your preferred date and time to visit this facility
          </DialogDescription>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Tour Scheduled!</h3>
            <p className="text-muted-foreground mb-4">
              Your tour at {facility.name} has been scheduled for {date && format(date, 'MMMM d, yyyy')} at {time}.
              The facility will contact you to confirm your appointment.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => 
                        isBefore(date, startOfDay(new Date())) || 
                        isBefore(addDays(new Date(), 90), date)
                      }
                      className="rounded-md"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tour Type</Label>
                    <Select value={tourType} onValueChange={setTourType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tour type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">In-Person Tour</SelectItem>
                        <SelectItem value="virtual">Virtual Tour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{facility.name}</p>
                        <p className="text-muted-foreground">{facility.location}</p>
                      </div>
                    </div>
                    {date && time && (
                      <div className="flex items-center gap-2 text-sm mt-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p>{format(date, 'MMMM d, yyyy')}</p>
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        <p>{time}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Your Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name*</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address*</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number*</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Any specific questions or areas of interest for your tour?"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Tour"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleTourModal;