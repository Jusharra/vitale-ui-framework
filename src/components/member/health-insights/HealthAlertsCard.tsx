
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";

interface AlertPreferences {
  alertBloodPressure: boolean;
  alertGlucose: boolean;
  alertMedication: boolean;
  alertAppointments: boolean;
}

const HealthAlertsCard: React.FC = () => {
  const form = useForm<AlertPreferences>({
    defaultValues: {
      alertBloodPressure: true,
      alertGlucose: true,
      alertMedication: false,
      alertAppointments: true,
    },
  });

  const onSubmit = (data: AlertPreferences) => {
    console.log(data);
    // This would save the alert preferences to the backend
  };

  return (
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
  );
};

export default HealthAlertsCard;
