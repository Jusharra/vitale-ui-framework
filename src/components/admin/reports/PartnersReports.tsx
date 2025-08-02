import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Download, Users, DollarSign, TrendingUp, Star } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Partner {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  status: string;
  created_at: string;
  rating: number;
  verified: boolean;
  consultation_fee: number;
  revenue_split_percentage: number;
}

interface PartnerStats {
  total: number;
  active: number;
  verified: number;
  avgRating: number;
  totalRevenue: number;
}

const PartnersReports = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerStats, setPartnerStats] = useState<PartnerStats>({
    total: 0,
    active: 0,
    verified: 0,
    avgRating: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPartnersData();
  }, [filterStatus, filterVerified]);

  const fetchPartnersData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (filterVerified !== 'all') {
        query = query.eq('verified', filterVerified === 'verified');
      }

      const { data, error } = await query;

      if (error) throw error;

      const typedPartners = (data || []) as Partner[];
      setPartners(typedPartners);

      // Calculate stats
      const stats = calculatePartnerStats(typedPartners);
      setPartnerStats(stats);

    } catch (error: any) {
      console.error('Error fetching partners data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load partners data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePartnerStats = (data: Partner[]): PartnerStats => {
    const total = data.length;
    const active = data.filter(p => p.status === 'active').length;
    const verified = data.filter(p => p.verified).length;
    const avgRating = total > 0 ? data.reduce((sum, p) => sum + (p.rating || 0), 0) / total : 0;
    const totalRevenue = data.reduce((sum, p) => sum + ((p.consultation_fee || 0) * 10), 0); // Estimated

    return {
      total,
      active,
      verified,
      avgRating,
      totalRevenue
    };
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Partners Reports', 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Stats summary
    let yPosition = 45;
    doc.setFontSize(12);
    doc.text('Partner Statistics:', 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Partners: ${partnerStats.total}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Active: ${partnerStats.active} | Verified: ${partnerStats.verified}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Average Rating: ${partnerStats.avgRating.toFixed(1)}/5`, 14, yPosition);
    yPosition += 6;
    doc.text(`Total Revenue: $${partnerStats.totalRevenue.toFixed(2)}`, 14, yPosition);
    
    // Partners table
    yPosition += 20;
    const tableData = partners.map(partner => [
      partner.name || 'N/A',
      partner.email || 'N/A',
      (partner.specialties || []).join(', ') || 'N/A',
      partner.status || 'N/A',
      partner.verified ? 'Yes' : 'No',
      `${partner.rating || 0}/5`
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Specialties', 'Status', 'Verified', 'Rating']],
      body: tableData,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`partners-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Success',
      description: 'Partners report exported successfully',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {partnerStats.active} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerStats.verified}</div>
            <p className="text-xs text-muted-foreground">
              {partnerStats.total > 0 ? ((partnerStats.verified / partnerStats.total) * 100).toFixed(1) : 0}% verified
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerStats.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">out of 5 stars</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${partnerStats.totalRevenue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Partners Data</CardTitle>
              <CardDescription>View and analyze partner information</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterVerified} onValueChange={setFilterVerified}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter verified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified Only</SelectItem>
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
          ) : partners.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No partners found</h3>
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
                    <TableHead>Email</TableHead>
                    <TableHead>Specialties</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        {partner.name || 'N/A'}
                      </TableCell>
                      <TableCell>{partner.email || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {(partner.specialties || []).join(', ') || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(partner.status)}>
                          {partner.status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={partner.verified ? 'default' : 'secondary'}>
                          {partner.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          {partner.rating || 0}/5
                        </div>
                      </TableCell>
                      <TableCell>
                        ${partner.consultation_fee || 0}
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

export default PartnersReports;