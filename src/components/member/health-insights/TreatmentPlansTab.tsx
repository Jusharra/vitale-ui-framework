
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DownloadReportButton from '@/components/member/DownloadReportButton';
import { TreatmentPlan } from '@/utils/pdf/types';

interface TreatmentPlansTabProps {
  treatmentPlans: TreatmentPlan[];
  handleDownloadSectionReport: (section: string) => void;
}

const TreatmentPlansTab: React.FC<TreatmentPlansTabProps> = ({ treatmentPlans, handleDownloadSectionReport }) => {
  const navigate = useNavigate();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Treatment Plans</CardTitle>
            <CardDescription>Current treatment plans from your healthcare team</CardDescription>
          </div>
          <DownloadReportButton
            onDownload={async () => handleDownloadSectionReport("treatments")}
            variant="outline"
            label="Export Plans"
            size="sm"
          />
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
    </>
  );
};

export default TreatmentPlansTab;
