
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ChevronDown, Sliders } from "lucide-react";

// Define the schema for the form
const formSchema = z.object({
  providerGender: z.enum(["any", "male", "female", "nonbinary"], {
    required_error: "Please select your provider gender preference.",
  }),
  providerExperience: z.enum(["any", "junior", "midlevel", "senior"], {
    required_error: "Please select your provider experience preference.",
  }),
  preferredLanguages: z.array(z.string()).optional(),
  specialAccommodations: z.boolean().default(false),
  accommodationDetails: z.string().optional(),
  notificationPreference: z.enum(["email", "sms", "both"], {
    required_error: "Please select your notification preference.",
  }),
  reminderTiming: z.enum(["1day", "2days", "1week"], {
    required_error: "Please select your reminder timing preference.",
  }),
  providerSpecialties: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Default values for the form
const defaultValues: Partial<FormValues> = {
  providerGender: "any",
  providerExperience: "any",
  preferredLanguages: [],
  specialAccommodations: false,
  accommodationDetails: "",
  notificationPreference: "email",
  reminderTiming: "1day",
  providerSpecialties: [],
};

const ServicePreferencesForm: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Mock function to save preferences - in a real app, this would call an API
  const onSubmit = (values: FormValues) => {
    console.log("Service preferences:", values);
    
    // Show success message
    toast({
      title: "Preferences Updated",
      description: "Your service preferences have been saved successfully.",
    });
  };
  
  const languages = [
    { id: "english", label: "English" },
    { id: "spanish", label: "Spanish" },
    { id: "mandarin", label: "Mandarin" },
    { id: "french", label: "French" },
    { id: "arabic", label: "Arabic" },
    { id: "hindi", label: "Hindi" },
  ];
  
  const specialties = [
    "Dermatology",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "General Practice",
  ];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Service Preferences</CardTitle>
            <CardDescription>
              Customize your preferences to help match you with the right care providers
            </CardDescription>
          </div>
          <Sliders className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="provider" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="provider">Provider Preferences</TabsTrigger>
                <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="provider" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="providerGender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Preferred Provider Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="any" />
                            </FormControl>
                            <FormLabel className="font-normal">No Preference</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="nonbinary" />
                            </FormControl>
                            <FormLabel className="font-normal">Non-binary</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="providerExperience"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Provider Experience Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="any" />
                            </FormControl>
                            <FormLabel className="font-normal">No Preference</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="junior" />
                            </FormControl>
                            <FormLabel className="font-normal">Junior (1-3 years)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="midlevel" />
                            </FormControl>
                            <FormLabel className="font-normal">Mid-level (4-7 years)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="senior" />
                            </FormControl>
                            <FormLabel className="font-normal">Senior (8+ years)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preferredLanguages"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Preferred Languages</FormLabel>
                        <FormDescription>
                          Select the languages you prefer your provider to speak
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {languages.map((language) => (
                          <FormField
                            key={language.id}
                            control={form.control}
                            name="preferredLanguages"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={language.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(language.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), language.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== language.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {language.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="providerSpecialties"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Provider Specialties</FormLabel>
                      <FormDescription>
                        Select specialties you're interested in
                      </FormDescription>
                      <FormControl>
                        <ToggleGroup 
                          type="multiple"
                          className="flex flex-wrap justify-start"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          {specialties.map((specialty) => (
                            <ToggleGroupItem 
                              key={specialty} 
                              value={specialty}
                              className="mb-2 mr-2"
                            >
                              {specialty}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="accommodations" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="specialAccommodations"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Special Accommodations
                          </FormLabel>
                          <FormDescription>
                            Do you require any special accommodations during your visit?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch("specialAccommodations") && (
                  <FormField
                    control={form.control}
                    name="accommodationDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accommodation Details</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Please describe any accommodations you need..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This information will be shared with your provider prior to your appointment.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
                  <div className="flex items-center justify-between space-x-4 px-4">
                    <h4 className="text-sm font-semibold">Additional Accommodation Information</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2 px-4">
                    <div className="rounded-md border px-4 py-3 text-sm">
                      Our providers are committed to making your visit as comfortable as possible. 
                      If you have any specific needs related to mobility, communication, sensory 
                      sensitivities, or other requirements, please let us know in advance.
                    </div>
                    <div className="rounded-md border px-4 py-3 text-sm">
                      For certain services, we may contact you prior to your appointment to discuss 
                      your accommodation needs in more detail. This helps us ensure we can provide 
                      the best possible experience.
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="notificationPreference"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Notification Preferences</FormLabel>
                      <FormDescription>
                        How would you like to receive appointment notifications?
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="email" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Email Only
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="sms" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              SMS Text Message Only
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="both" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Both Email and SMS
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reminderTiming"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Reminder Timing</FormLabel>
                      <FormDescription>
                        When would you like to receive appointment reminders?
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1day" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              1 day before appointment
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2days" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              2 days before appointment
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1week" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              1 week before appointment
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <CardFooter className="px-0 pb-0">
              <Button type="submit" className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ServicePreferencesForm;
