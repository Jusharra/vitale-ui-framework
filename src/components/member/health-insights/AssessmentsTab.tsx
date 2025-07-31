
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DownloadReportButton from '@/components/member/DownloadReportButton';

interface Assessment {
  id: number;
  name: string;
  duration: string;
  completed: boolean;
}

interface AssessmentsTabProps {
  assessments: Assessment[];
  handleDownloadSectionReport: (section: string) => void;
}

const AssessmentsTab: React.FC<AssessmentsTabProps> = ({ assessments, handleDownloadSectionReport }) => {
  const handleStartAssessment = (assessmentId: number) => {
    // In a real app, this would navigate to the assessment
    console.log(`Starting assessment ${assessmentId}`);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Health Assessments</CardTitle>
            <CardDescription>Complete these assessments to get personalized health recommendations</CardDescription>
          </div>
          <DownloadReportButton
            onDownload={async () => handleDownloadSectionReport("assessments")}
            variant="outline"
            label="Export Results"
            size="sm"
          />
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
    </>
  );
};

export default AssessmentsTab;
