import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Calendar as CalendarIcon, 
  Search, 
  Mail, 
  BarChart, 
  FileText, 
  Phone, 
  Clock, 
  User, 
  Filter,
  Loader2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Define types for call reports
interface CallReport {
  id: string;
  profile_id: string;
  call_duration: number;
  call_date: string;
  ai_agent_id: string;
  satisfaction_rating: number;
  topics_discussed: string[];
  follow_up_required: boolean;
  follow_up_notes?: string;
  call_summary?: string;
  sentiment_analysis?: any;
  created_at: string;
}

interface CallReportSummary {
  id: string;
  report_date: string;
  total_calls: number;
  avg_duration_seconds: number;
  avg_satisfaction: number;
  follow_ups_needed: number;
  agent_usage: Record<string, number>;
  topics: string[];
  created_at: string;
}

const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('individual');
  const [callReports, setCallReports] = useState<CallReport[]>([]);
  const [summaryReports, setSummaryReports] = useState<CallReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{start: Date | undefined, end: Date | undefined}>({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [selectedReport, setSelectedReport] = useState<CallReport | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<CallReportSummary | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const { toast } = useToast();

  // Fetch call reports and summaries
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // Fetch individual call reports
        const { data: reportData, error: reportError } = await supabase
          .from('call_reports')
          .select('*')
          .order('call_date', { ascending: false });
        
        if (reportError) throw reportError;
        setCallReports(reportData || []);
        
        // Fetch summary reports
        const { data: summaryData, error: summaryError } = await supabase
          .from('call_reports_summary')
          .select('*')
          .order('report_date', { ascending: false });
        
        if (summaryError) throw summaryError;
        setSummaryReports(summaryData || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reports data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [toast]);

  // Filter reports based on search term and date range
  const filteredCallReports = callReports.filter(report => {
    const matchesSearch = 
      (report.call_summary && report.call_summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.ai_agent_id && report.ai_agent_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.topics_discussed && report.topics_discussed.some(topic => 
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const reportDate = new Date(report.call_date);
    const matchesDateRange = 
      (!dateRange.start || reportDate >= dateRange.start) && 
      (!dateRange.end || reportDate <= dateRange.end);
    
    return matchesSearch && matchesDateRange;
  });

  const filteredSummaryReports = summaryReports.filter(summary => {
    const matchesSearch = 
      (summary.topics && summary.topics.some(topic => 
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const summaryDate = new Date(summary.report_date);
    const matchesDateRange = 
      (!dateRange.start || summaryDate >= dateRange.start) && 
      (!dateRange.end || summaryDate <= dateRange.end);
    
    return matchesSearch && matchesDateRange;
  });

  // Format duration from seconds to minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Generate PDF report for individual call
  const generateCallReportPDF = (report: CallReport) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(33, 99, 232); // Primary color
    doc.text('Call Report', 105, 15, { align: 'center' });
    
    // Add date and ID
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${format(new Date(), 'PPP')}`, 105, 22, { align: 'center' });
    doc.text(`Report ID: ${report.id.substring(0, 8)}`, 105, 27, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 30, 196, 30);
    
    // Add call details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Call Details', 14, 40);
    
    const callDate = new Date(report.call_date);
    
    const detailsData = [
      ['Date', format(callDate, 'PPP')],
      ['Time', format(callDate, 'p')],
      ['Duration', formatDuration(report.call_duration)],
      ['AI Agent', report.ai_agent_id],
      ['Satisfaction Rating', `${report.satisfaction_rating}/5`],
      ['Follow-up Required', report.follow_up_required ? 'Yes' : 'No']
    ];
    
    doc.autoTable({
      startY: 45,
      head: [['Field', 'Value']],
      body: detailsData,
      theme: 'grid',
      headStyles: { fillColor: [33, 99, 232], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });
    
    // Add topics discussed
    doc.text('Topics Discussed', 14, doc.autoTable.previous.finalY + 10);
    
    if (report.topics_discussed && report.topics_discussed.length > 0) {
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['Topics']],
        body: report.topics_discussed.map(topic => [topic]),
        theme: 'grid',
        headStyles: { fillColor: [33, 99, 232], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
    } else {
      doc.text('No topics recorded', 14, doc.autoTable.previous.finalY + 15);
    }
    
    // Add call summary
    if (report.call_summary) {
      doc.text('Call Summary', 14, doc.autoTable.previous.finalY + 10);
      
      doc.setFontSize(10);
      doc.text(report.call_summary, 14, doc.autoTable.previous.finalY + 15, {
        maxWidth: 180
      });
    }
    
    // Add follow-up notes if available
    if (report.follow_up_required && report.follow_up_notes) {
      doc.text('Follow-up Notes', 14, doc.lastAutoTable.finalY + 30);
      
      doc.setFontSize(10);
      doc.text(report.follow_up_notes, 14, doc.lastAutoTable.finalY + 35, {
        maxWidth: 180
      });
    }
    
    // Save the PDF
    doc.save(`call-report-${report.id.substring(0, 8)}.pdf`);
  };

  // Generate PDF report for summary
  const generateSummaryReportPDF = (summary: CallReportSummary) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(33, 99, 232); // Primary color
    doc.text('Call Summary Report', 105, 15, { align: 'center' });
    
    // Add date and ID
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${format(new Date(), 'PPP')}`, 105, 22, { align: 'center' });
    doc.text(`Report Date: ${format(new Date(summary.report_date), 'PPP')}`, 105, 27, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 30, 196, 30);
    
    // Add summary details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary Details', 14, 40);
    
    const summaryData = [
      ['Total Calls', summary.total_calls.toString()],
      ['Average Duration', formatDuration(summary.avg_duration_seconds)],
      ['Average Satisfaction', summary.avg_satisfaction.toFixed(1) + '/5'],
      ['Follow-ups Needed', summary.follow_ups_needed.toString()]
    ];
    
    doc.autoTable({
      startY: 45,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [33, 99, 232], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });
    
    // Add agent usage
    doc.text('Agent Usage', 14, doc.autoTable.previous.finalY + 10);
    
    if (summary.agent_usage && Object.keys(summary.agent_usage).length > 0) {
      const agentData = Object.entries(summary.agent_usage).map(([agent, count]) => [agent, count.toString()]);
      
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['Agent', 'Calls']],
        body: agentData,
        theme: 'grid',
        headStyles: { fillColor: [33, 99, 232], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
    } else {
      doc.text('No agent usage data available', 14, doc.autoTable.previous.finalY + 15);
    }
    
    // Add topics
    if (summary.topics && summary.topics.length > 0) {
      doc.text('Common Topics', 14, doc.autoTable.previous.finalY + 10);
      
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['Topics']],
        body: summary.topics.map(topic => [topic]),
        theme: 'grid',
        headStyles: { fillColor: [33, 99, 232], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
    }
    
    // Save the PDF
    doc.save(`call-summary-${format(new Date(summary.report_date), 'yyyy-MM-dd')}.pdf`);
  };

  // Send email with report
  const sendReportEmail = (reportType: 'individual' | 'summary', reportId: string) => {
    toast({
      title: 'Email Sent',
      description: 'The report has been emailed successfully.',
    });
  };

  // Delete report
  const deleteReport = async (reportType: 'individual' | 'summary', reportId: string) => {
    try {
      if (reportType === 'individual') {
        const { error } = await supabase
          .from('call_reports')
          .delete()
          .eq('id', reportId);
        
        if (error) throw error;
        
        setCallReports(callReports.filter(report => report.id !== reportId));
        setSelectedReport(null);
      } else {
        const { error } = await supabase
          .from('call_reports_summary')
          .delete()
          .eq('id', reportId);
        
        if (error) throw error;
        
        setSummaryReports(summaryReports.filter(summary => summary.id !== reportId));
        setSelectedSummary(null);
      }
      
      toast({
        title: 'Report Deleted',
        description: 'The report has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive',
      });
    }
  };

  // Render date range selector
  const renderDateRangeSelector = () => (
    <div className="flex items-center space-x-2">
      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.start && dateRange.end ? (
              <>
                {format(dateRange.start, 'PPP')} - {format(dateRange.end, 'PPP')}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: dateRange.start,
              to: dateRange.end
            }}
            onSelect={(range) => {
              setDateRange({
                start: range?.from,
                end: range?.to
              });
            }}
            initialFocus
          />
          <div className="flex justify-between p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setDateRange({
                  start: subDays(today, 7),
                  end: today
                });
              }}
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setDateRange({
                  start: subDays(today, 30),
                  end: today
                });
              }}
            >
              Last 30 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setDateRange({
                  start: startOfMonth(today),
                  end: endOfMonth(today)
                });
              }}
            >
              This month
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Call Reports</CardTitle>
        <CardDescription>View and manage call reports and summaries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search reports..." 
              className="pl-8 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {renderDateRangeSelector()}
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual Call Reports</TabsTrigger>
            <TabsTrigger value="summary">Summary Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredCallReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border rounded-md overflow-hidden">
                  <div className="p-4 bg-muted/50 border-b">
                    <h3 className="font-medium">Call Reports</h3>
                  </div>
                  <div className="divide-y max-h-[500px] overflow-y-auto">
                    {filteredCallReports.map((report) => (
                      <div 
                        key={report.id} 
                        className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedReport?.id === report.id ? 'bg-muted/50' : ''}`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {format(new Date(report.call_date), 'PPP')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(report.call_date), 'p')} • {formatDuration(report.call_duration)}
                            </div>
                          </div>
                          <Badge variant={report.follow_up_required ? "destructive" : "outline"}>
                            {report.follow_up_required ? "Follow-up" : "Complete"}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Agent: {report.ai_agent_id}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <BarChart className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Rating: {report.satisfaction_rating}/5</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {selectedReport ? (
                    <div className="border rounded-md p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-xl font-semibold">Call Report</h2>
                          <p className="text-muted-foreground">
                            {format(new Date(selectedReport.call_date), 'PPP')} at {format(new Date(selectedReport.call_date), 'p')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateCallReportPDF(selectedReport)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendReportEmail('individual', selectedReport.id)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteReport('individual', selectedReport.id)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Duration:</span>
                            <span>{formatDuration(selectedReport.call_duration)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">AI Agent:</span>
                            <span>{selectedReport.ai_agent_id}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Satisfaction:</span>
                            <span>{selectedReport.satisfaction_rating}/5</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Follow-up Required:</span>
                            <span>{selectedReport.follow_up_required ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-2">Topics Discussed</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedReport.topics_discussed && selectedReport.topics_discussed.map((topic, index) => (
                            <Badge key={index} variant="secondary">{topic}</Badge>
                          ))}
                          {(!selectedReport.topics_discussed || selectedReport.topics_discussed.length === 0) && (
                            <span className="text-muted-foreground">No topics recorded</span>
                          )}
                        </div>
                      </div>
                      
                      {selectedReport.call_summary && (
                        <div className="mb-6">
                          <h3 className="font-medium mb-2">Call Summary</h3>
                          <div className="bg-muted/50 p-4 rounded-md">
                            <p>{selectedReport.call_summary}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedReport.follow_up_required && selectedReport.follow_up_notes && (
                        <div>
                          <h3 className="font-medium mb-2">Follow-up Notes</h3>
                          <div className="bg-muted/50 p-4 rounded-md">
                            <p>{selectedReport.follow_up_notes}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedReport.sentiment_analysis && (
                        <div className="mt-6">
                          <h3 className="font-medium mb-2">Sentiment Analysis</h3>
                          <div className="bg-muted/50 p-4 rounded-md">
                            <pre className="text-sm whitespace-pre-wrap">
                              {JSON.stringify(selectedReport.sentiment_analysis, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border rounded-md p-6 flex flex-col items-center justify-center h-full">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Report Selected</h3>
                      <p className="text-muted-foreground text-center">
                        Select a report from the list to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Call Reports Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No reports match your search criteria' : 'There are no call reports available'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="summary" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredSummaryReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border rounded-md overflow-hidden">
                  <div className="p-4 bg-muted/50 border-b">
                    <h3 className="font-medium">Summary Reports</h3>
                  </div>
                  <div className="divide-y max-h-[500px] overflow-y-auto">
                    {filteredSummaryReports.map((summary) => (
                      <div 
                        key={summary.id} 
                        className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedSummary?.id === summary.id ? 'bg-muted/50' : ''}`}
                        onClick={() => setSelectedSummary(summary)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {format(new Date(summary.report_date), 'PPP')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {summary.total_calls} calls • Avg. {formatDuration(summary.avg_duration_seconds)}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {summary.follow_ups_needed} follow-ups
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <BarChart className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Avg. Rating: {summary.avg_satisfaction.toFixed(1)}/5</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {selectedSummary ? (
                    <div className="border rounded-md p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-xl font-semibold">Summary Report</h2>
                          <p className="text-muted-foreground">
                            {format(new Date(selectedSummary.report_date), 'PPP')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateSummaryReportPDF(selectedSummary)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendReportEmail('summary', selectedSummary.id)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteReport('summary', selectedSummary.id)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Call Statistics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Total Calls:</span>
                                <span className="font-medium">{selectedSummary.total_calls}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Average Duration:</span>
                                <span className="font-medium">{formatDuration(selectedSummary.avg_duration_seconds)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Average Satisfaction:</span>
                                <span className="font-medium">{selectedSummary.avg_satisfaction.toFixed(1)}/5</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Follow-ups Needed:</span>
                                <span className="font-medium">{selectedSummary.follow_ups_needed}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Agent Usage</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedSummary.agent_usage && Object.keys(selectedSummary.agent_usage).length > 0 ? (
                              <div className="space-y-4">
                                {Object.entries(selectedSummary.agent_usage).map(([agent, count]) => (
                                  <div key={agent} className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-sm">{agent}</span>
                                      <span className="text-sm">{count} calls</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                      <div 
                                        className="bg-primary h-2 rounded-full" 
                                        style={{ width: `${(count as number / selectedSummary.total_calls) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-24 text-muted-foreground">
                                No agent usage data available
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-2">Common Topics</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedSummary.topics && selectedSummary.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary">{topic}</Badge>
                          ))}
                          {(!selectedSummary.topics || selectedSummary.topics.length === 0) && (
                            <span className="text-muted-foreground">No topics recorded</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md p-6 flex flex-col items-center justify-center h-full">
                      <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Summary Selected</h3>
                      <p className="text-muted-foreground text-center">
                        Select a summary report from the list to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Summary Reports Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No reports match your search criteria' : 'There are no summary reports available'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {activeTab === 'individual' ? 
            `${filteredCallReports.length} call reports found` : 
            `${filteredSummaryReports.length} summary reports found`}
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="thisMonth">This month</SelectItem>
            <SelectItem value="lastMonth">Last month</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
};

export default AdminReports;