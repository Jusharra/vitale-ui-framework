
import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { FilePdf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadReportButtonProps extends ButtonProps {
  onDownload: () => void;
  label?: string;
}

const DownloadReportButton: React.FC<DownloadReportButtonProps> = ({ 
  onDownload, 
  label = "Download PDF Report", 
  ...buttonProps 
}) => {
  const { toast } = useToast();
  
  const handleClick = () => {
    try {
      onDownload();
      toast({
        title: "Report Download Started",
        description: "Your health insights report is being generated.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error Downloading Report",
        description: "There was a problem generating your report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Button onClick={handleClick} {...buttonProps}>
      <FilePdf />
      {label}
    </Button>
  );
};

export default DownloadReportButton;
