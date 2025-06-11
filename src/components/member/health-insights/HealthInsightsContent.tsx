import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DownloadReportButton from '@/components/member/DownloadReportButton';
import { downloadHealthInsightsPDF } from '@/utils/pdfGenerator';
import { format } from 'date-fns';

import HealthInsightsDashboard from './HealthInsightsDashboard';
import AssessmentsTab from './AssessmentsTab';
import TreatmentPlansTab from './TreatmentPlansTab';
import HealthDataDisplay from './HealthDataDisplay';
import HealthAlertsCard from './HealthAlertsCard';

// Import mock data
import { 
  vitalSigns, 
  weightData, 
  allergyData, 
  mentalHealthData, 
  treatmentPlans,
  assessments 
} from './mockData';

const HealthInsightsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("vitals");
  const [currentTabValue, setCurrentTabValue] = useState("insights");
  
  // Function to download all health data as PDF
  const handleDownloadFullReport = async () => {
    const healthData = {
      vitalSigns,
      weightData,
      allergyData,
      mentalHealthData,
      treatmentPlans,
    };
    
    const fileName = `health-insights-report-${format(new Date(), 'yyyy-MM-dd')}`;
    await downloadHealthInsightsPDF(healthData, fileName);
  };
  
  // Function to download section-specific report
  const handleDownloadSectionReport = async (section: string) => {
    let sectionData = {
      vitalSigns: [],
      weightData: [],
      allergyData: [],
      mentalHealthData: [],
      treatmentPlans: [],
    };
    
    switch(section) {
      case 'vitals':
        sectionData.vitalSigns = vitalSigns;
        break;
      case 'weight':
        sectionData.weightData = weightData;
        break;
      case 'allergies':
        sectionData.allergyData = allergyData;
        break;
      case 'mental':
        sectionData.mentalHealthData = mentalHealthData;
        break;
      case 'treatments':
        sectionData.treatmentPlans = treatmentPlans;
        break;
      default:
        break;
    }
    
    const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
    const fileName = `health-${sectionName}-report-${format(new Date(), 'yyyy-MM-dd')}`;
    await downloadHealthInsightsPDF(sectionData, fileName);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs 
          defaultValue="insights" 
          className="w-full"
          value={currentTabValue}
          onValueChange={setCurrentTabValue}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
              <TabsTrigger value="insights">Health Insights</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="treatments">Treatment Plans</TabsTrigger>
            </TabsList>
            
            <DownloadReportButton
              onDownload={handleDownloadFullReport}
              variant="outline"
              className="ml-2"
            />
          </div>
          
          <TabsContent value="insights" className="space-y-6">
            <HealthInsightsDashboard 
              setActiveTab={setActiveTab} 
            />
            
            <HealthDataDisplay 
              activeTab={activeTab}
              vitalSigns={vitalSigns}
              weightData={weightData}
              allergyData={allergyData}
              mentalHealthData={mentalHealthData}
              handleDownloadSectionReport={handleDownloadSectionReport}
            />
            
            <HealthAlertsCard />
          </TabsContent>
          
          <TabsContent value="assessments" className="space-y-6">
            <AssessmentsTab 
              assessments={assessments} 
              handleDownloadSectionReport={handleDownloadSectionReport} 
            />
          </TabsContent>
          
          <TabsContent value="treatments" className="space-y-6">
            <TreatmentPlansTab 
              treatmentPlans={treatmentPlans} 
              handleDownloadSectionReport={handleDownloadSectionReport} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthInsightsContent;