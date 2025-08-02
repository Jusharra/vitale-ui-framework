import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Download, Users, TrendingUp, Mail, Phone } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  lead_score: number;
  created_at: string;
  last_contact: string;
  service_needed: string;
}

interface LeadStats {
  total: number;
  new: number;
  qualified: number;
  converted: number;
  lost: number;
  conversionRate: number;
}

const LeadsReports = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadStats, setLeadStats] = useState<LeadStats>({
    total: 0,
    new: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
    conversionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchLeadsData();
  }, [filterStatus, filterSource]);

  const fetchLeadsData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (filterSource !== 'all') {
        query = query.eq('source', filterSource);
      }

      const { data, error } = await query;

      if (error) throw error;

      const typedLeads = (data || []) as Lead[];
      setLeads(typedLeads);

      // Calculate stats
      const stats = calculateLeadStats(typedLeads);
      setLeadStats(stats);

    } catch (error: any) {
      console.error('Error fetching leads data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leads data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLeadStats = (data: Lead[]): LeadStats => {
    const total = data.length;
    const statusCounts = data.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const converted = statusCounts.converted || 0;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    return {
      total,
      new: statusCounts.new || 0,
      qualified: statusCounts.qualified || 0,
      converted,
      lost: statusCounts.lost || 0,
      conversionRate
    };
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Leads Reports', 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Stats summary
    let yPosition = 45;
    doc.setFontSize(12);
    doc.text('Lead Statistics:', 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Leads: ${leadStats.total}`, 14, yPosition);
    yPosition += 6;
    doc.text(`New: ${leadStats.new} | Qualified: ${leadStats.qualified} | Converted: ${leadStats.converted}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Conversion Rate: ${leadStats.conversionRate.toFixed(1)}%`, 14, yPosition);
    
    // Leads table
    yPosition += 20;
    const tableData = leads.map(lead => [
      `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'N/A',
      lead.email || 'N/A',
      lead.phone || 'N/A',
      lead.status || 'N/A',
      lead.source || 'N/A',
      new Date(lead.created_at).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Phone', 'Status', 'Source', 'Created']],
      body: tableData,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`leads-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Success',
      description: 'Leads report exported successfully',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'converted': return 'default';
      case 'qualified': return 'secondary';
      case 'new': return 'outline';
      case 'lost': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.qualified}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.converted}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Leads Data</CardTitle>
              <CardDescription>View and analyze lead information</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportToPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No leads found</h3>
              <p className="text-muted-foreground">
                Adjust your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        {`${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {lead.email || 'N/A'}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(lead.status)}>
                          {lead.status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.source || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {lead.lead_score || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsReports;