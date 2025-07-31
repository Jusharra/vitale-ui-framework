
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Calendar, Phone, Clock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define interfaces
interface CallReport {
  id: string;
  call_date: string;
  call_duration: number;
  satisfaction_rating: number;
  call_summary: string;
  topics_discussed: string[];
  follow_up_required: boolean;
  follow_up_notes: string;
  ai_agent_id: string;
  sentiment_analysis: Record<string, any>;
  profile_id: string;
  user_id: string;
  created_at: string;
}

interface CallReportSummary {
  id: string;
  report_date: string;
  total_calls: number;
  avg_satisfaction: number;
  avg_duration_seconds: number;
  follow_ups_needed: number;
  topics: string[];
  agent_usage: Record<string, number>;
  created_at: string;
}

const AdminReports = () => {
  const [reports, setReports] = useState<CallReport[]>([]);
  const [summaryReports, setSummaryReports] = useState<CallReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('individual');
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
    fetchSummaryReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('call_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching call reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load call reports',
        variant: 'destructive',
      });
    }
  };

  const fetchSummaryReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('call_reports_summary')
        .select('*')
        .order('report_date', { ascending: false });

      if (error) throw error;
      
      // Type cast and handle potential type mismatches
      const typedData = (data || []).map(item => ({
        ...item,
        agent_usage: typeof item.agent_usage === 'object' ? item.agent_usage as Record<string, number> : {}
      }));
      
      setSummaryReports(typedData);
    } catch (error: any) {
      console.error('Error fetching summary reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load summary reports',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const exportToPDF = (reportType: 'individual' | 'summary') => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Add title
    doc.setFontSize(16);
    doc.text(`${reportType === 'individual' ? 'Individual' : 'Summary'} Call Reports`, 14, yPosition);
    yPosition += 10;

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, yPosition);
    yPosition += 20;

    if (reportType === 'individual') {
      const tableData = reports.map(report => [
        new Date(report.call_date).toLocaleDateString(),
        formatDuration(report.call_duration),
        report.satisfaction_rating.toString(),
        report.call_summary.substring(0, 50) + '...',
        report.follow_up_required ? 'Yes' : 'No'
      ]);

      autoTable(doc, {
        head: [['Date', 'Duration', 'Rating', 'Summary', 'Follow-up']],
        body: tableData,
        startY: yPosition,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text('Report Statistics:', 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      const avgSatisfaction = reports.reduce((sum, r) => sum + r.satisfaction_rating, 0) / reports.length;
      const avgDuration = reports.reduce((sum, r) => sum + r.call_duration, 0) / reports.length;
      
      doc.text(`Total Reports: ${reports.length}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Average Satisfaction: ${avgSatisfaction.toFixed(1)}/5`, 14, yPosition);
      yPosition += 6;
      doc.text(`Average Duration: ${formatDuration(Math.round(avgDuration))}`, 14, yPosition);
    } else {
      const tableData = summaryReports.map(summary => [
        new Date(summary.report_date).toLocaleDateString(),
        summary.total_calls.toString(),
        summary.avg_satisfaction.toFixed(1),
        formatDuration(summary.avg_duration_seconds),
        summary.follow_ups_needed.toString()
      ]);

      autoTable(doc, {
        head: [['Date', 'Total Calls', 'Avg Rating', 'Avg Duration', 'Follow-ups']],
        body: tableData,
        startY: yPosition,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;

      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text('Summary Statistics:', 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      const totalCalls = summaryReports.reduce((sum, s) => sum + s.total_calls, 0);
      const avgOverallSatisfaction = summaryReports.reduce((sum, s) => sum + s.avg_satisfaction, 0) / summaryReports.length;
      
      doc.text(`Total Calls: ${totalCalls}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Overall Avg Satisfaction: ${avgOverallSatisfaction.toFixed(1)}/5`, 14, yPosition);
    }

    doc.save(`${reportType}-call-reports-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Success',
      description: 'PDF report exported successfully',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Call Reports</CardTitle>
          <CardDescription>View and analyze call reports and metrics</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="individual">Individual Reports</TabsTrigger>
            <TabsTrigger value="summary">Summary Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Individual Call Reports</h3>
              <Button onClick={() => exportToPDF('individual')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
            
            {reports.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No call reports found</h3>
                <p className="text-muted-foreground">
                  Call reports will appear here once calls are made.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Follow-up</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(report.call_date).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDuration(report.call_duration)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={report.satisfaction_rating >= 4 ? 'default' : report.satisfaction_rating >= 3 ? 'secondary' : 'destructive'}>
                            {report.satisfaction_rating}/5
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {report.call_summary}
                        </TableCell>
                        <TableCell>
                          <Badge variant={report.follow_up_required ? 'destructive' : 'secondary'}>
                            {report.follow_up_required ? 'Required' : 'None'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="summary" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Summary Reports</h3>
              <Button onClick={() => exportToPDF('summary')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
            
            {summaryReports.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No summary reports found</h3>
                <p className="text-muted-foreground">
                  Summary reports will be generated based on call data.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Calls</TableHead>
                      <TableHead>Avg Rating</TableHead>
                      <TableHead>Avg Duration</TableHead>
                      <TableHead>Follow-ups Needed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryReports.map((summary) => (
                      <TableRow key={summary.id}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(summary.report_date).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{summary.total_calls}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={summary.avg_satisfaction >= 4 ? 'default' : summary.avg_satisfaction >= 3 ? 'secondary' : 'destructive'}>
                            {summary.avg_satisfaction.toFixed(1)}/5
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDuration(summary.avg_duration_seconds)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={summary.follow_ups_needed > 0 ? 'destructive' : 'secondary'}>
                            {summary.follow_ups_needed}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminReports;
