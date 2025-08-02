import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Download, Users, TrendingUp, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MembershipData {
  id: string;
  full_name: string;
  email: string;
  membership_tier: string;
  created_at: string;
  last_activity: string;
  total_spent: number;
  status: string;
}

interface MembershipStats {
  tier: string;
  count: number;
  percentage: number;
  revenue: number;
}

const MembershipReports = () => {
  const [membershipData, setMembershipData] = useState<MembershipData[]>([]);
  const [membershipStats, setMembershipStats] = useState<MembershipStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMembershipData();
  }, [filterTier]);

  const fetchMembershipData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (filterTier !== 'all') {
        query = query.eq('role', filterTier);
      }

      const { data, error } = await query;

      if (error) throw error;

      const processedData: MembershipData[] = (data || []).map(user => ({
        ...user,
        membership_tier: user.role || 'member',
        last_activity: user.created_at, // Placeholder
        total_spent: Math.random() * 1000, // Placeholder
        status: 'active'
      }));

      setMembershipData(processedData);

      // Calculate stats
      const stats = calculateMembershipStats(processedData);
      setMembershipStats(stats);

    } catch (error: any) {
      console.error('Error fetching membership data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load membership data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMembershipStats = (data: MembershipData[]): MembershipStats[] => {
    const tierCounts = data.reduce((acc, member) => {
      const tier = member.membership_tier || 'member';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = data.length;
    
    return Object.entries(tierCounts).map(([tier, count]) => ({
      tier,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      revenue: count * (tier === 'admin' ? 0 : tier === 'partner' ? 150 : tier === 'professional' ? 100 : 50) // Example pricing
    }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Membership Reports', 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Stats summary
    let yPosition = 45;
    doc.setFontSize(12);
    doc.text('Membership Statistics:', 14, yPosition);
    yPosition += 10;
    
    membershipStats.forEach(stat => {
      doc.setFontSize(10);
      doc.text(`${stat.tier.toUpperCase()}: ${stat.count} members (${stat.percentage.toFixed(1)}%) - $${stat.revenue.toFixed(2)} revenue`, 14, yPosition);
      yPosition += 6;
    });
    
    // Members table
    yPosition += 20;
    const tableData = membershipData.map(member => [
      member.full_name || 'N/A',
      member.email,
      member.membership_tier || 'smart',
      new Date(member.created_at).toLocaleDateString(),
      member.status
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Tier', 'Joined', 'Status']],
      body: tableData,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`membership-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Success',
      description: 'Membership report exported successfully',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {membershipStats.map((stat) => (
          <Card key={stat.tier}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.tier.toUpperCase()} Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">
                {stat.percentage.toFixed(1)}% of total
              </p>
              <div className="text-sm text-muted-foreground mt-1">
                ${stat.revenue.toFixed(2)} revenue
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Membership Data</CardTitle>
              <CardDescription>View and analyze membership information</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
          ) : membershipData.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No membership data found</h3>
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
                    <TableHead>Membership Tier</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membershipData.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                      <Badge variant={
                          member.membership_tier === 'admin' ? 'default' :
                          member.membership_tier === 'partner' ? 'secondary' : 'outline'
                        }>
                          {(member.membership_tier || 'member').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{new Date(member.created_at).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {member.status}
                        </Badge>
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

export default MembershipReports;