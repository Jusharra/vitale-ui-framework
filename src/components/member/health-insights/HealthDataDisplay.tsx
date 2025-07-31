
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DownloadReportButton from '@/components/member/DownloadReportButton';
import { VitalSign, WeightRecord, Allergy, MentalHealthRecord } from '@/utils/pdf/types';

interface HealthDataDisplayProps {
  activeTab: string;
  vitalSigns: VitalSign[];
  weightData: WeightRecord[];
  allergyData: Allergy[];
  mentalHealthData: MentalHealthRecord[];
  handleDownloadSectionReport: (section: string) => void;
}

const HealthDataDisplay: React.FC<HealthDataDisplayProps> = ({
  activeTab,
  vitalSigns,
  weightData,
  allergyData,
  mentalHealthData,
  handleDownloadSectionReport
}) => {
  if (activeTab === "vitals") {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vital Signs</CardTitle>
            <CardDescription>Your recent health measurements</CardDescription>
          </div>
          <DownloadReportButton
            onDownload={async () => handleDownloadSectionReport("vitals")}
            variant="outline"
            label="Export"
            size="sm"
          />
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
    );
  }

  if (activeTab === "weight") {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weight Management</CardTitle>
            <CardDescription>Track your weight trends over time</CardDescription>
          </div>
          <DownloadReportButton
            onDownload={async () => handleDownloadSectionReport("weight")}
            variant="outline"
            label="Export"
            size="sm"
          />
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
    );
  }

  if (activeTab === "allergies") {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Allergies</CardTitle>
            <CardDescription>Important allergy information to share with providers</CardDescription>
          </div>
          <DownloadReportButton
            onDownload={async () => handleDownloadSectionReport("allergies")}
            variant="outline"
            label="Export"
            size="sm"
          />
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
    );
  }

  if (activeTab === "mental") {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mental Health Insights</CardTitle>
            <CardDescription>Results from your mental health assessments</CardDescription>
          </div>
          <DownloadReportButton
            onDownload={async () => handleDownloadSectionReport("mental")}
            variant="outline"
            label="Export"
            size="sm"
          />
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
    );
  }

  return null;
};

export default HealthDataDisplay;
