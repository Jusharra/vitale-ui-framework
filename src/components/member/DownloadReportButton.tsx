import React, { useState } from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadReportButtonProps extends ButtonProps {
  onDownload: () => Promise<void>;
  label?: string;
}

const DownloadReportButton: React.FC<DownloadReportButtonProps> = ({ 
  onDownload, 
  label = "Download PDF Report", 
  ...buttonProps 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleClick = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Report Download Started",
        description: "Your health insights report is being generated.",
      });
      
      await onDownload();
      
      toast({
        title: "Report Downloaded",
        description: "Your health insights report has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error Downloading Report",
        description: "There was a problem generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button onClick={handleClick} disabled={isGenerating} {...buttonProps}>
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};

export default DownloadReportButton;