import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Download, Building2, MapPin, Users, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Facility {
  id: string;
  name: string;
  location: string;
  care_type: string;
  status: string;
  spots_available: number;
  price_range: string;
  featured: boolean;
  created_at: string;
  services: string[];
  amenities: string[];
}

interface FacilityStats {
  total: number;
  active: number;
  featured: number;
  totalSpots: number;
  avgPrice: string;
}

const FacilitiesReports = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityStats, setFacilityStats] = useState<FacilityStats>({
    total: 0,
    active: 0,
    featured: 0,
    totalSpots: 0,
    avgPrice: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCareType, setFilterCareType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchFacilitiesData();
  }, [filterStatus, filterCareType]);

  const fetchFacilitiesData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('care_facilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (filterCareType !== 'all') {
        query = query.eq('care_type', filterCareType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const typedFacilities = (data || []) as Facility[];
      setFacilities(typedFacilities);

      // Calculate stats
      const stats = calculateFacilityStats(typedFacilities);
      setFacilityStats(stats);

    } catch (error: any) {
      console.error('Error fetching facilities data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFacilityStats = (data: Facility[]): FacilityStats => {
    const total = data.length;
    const active = data.filter(f => f.status === 'active').length;
    const featured = data.filter(f => f.featured).length;
    const totalSpots = data.reduce((sum, f) => sum + (f.spots_available || 0), 0);
    
    // Calculate average price range (simplified)
    const priceRanges = data.map(f => f.price_range).filter(Boolean);
    const avgPrice = priceRanges.length > 0 ? 'Varied' : 'N/A';

    return {
      total,
      active,
      featured,
      totalSpots,
      avgPrice
    };
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Care Facilities Reports', 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Stats summary
    let yPosition = 45;
    doc.setFontSize(12);
    doc.text('Facility Statistics:', 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Facilities: ${facilityStats.total}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Active: ${facilityStats.active} | Featured: ${facilityStats.featured}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Total Available Spots: ${facilityStats.totalSpots}`, 14, yPosition);
    
    // Facilities table
    yPosition += 20;
    const tableData = facilities.map(facility => [
      facility.name || 'N/A',
      facility.location || 'N/A',
      facility.care_type || 'N/A',
      facility.status || 'N/A',
      (facility.spots_available || 0).toString(),
      facility.price_range || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Name', 'Location', 'Care Type', 'Status', 'Spots', 'Price Range']],
      body: tableData,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`facilities-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Success',
      description: 'Facilities report exported successfully',
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
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {facilityStats.active} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.featured}</div>
            <p className="text-xs text-muted-foreground">
              featured listings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.totalSpots}</div>
            <p className="text-xs text-muted-foreground">total capacity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Range</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.avgPrice}</div>
            <p className="text-xs text-muted-foreground">pricing tiers</p>
          </CardContent>
        </Card>
      </div>

      {/* Facilities Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Facilities Data</CardTitle>
              <CardDescription>View and analyze care facility information</CardDescription>
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
              <Select value={filterCareType} onValueChange={setFilterCareType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="assisted_living">Assisted Living</SelectItem>
                  <SelectItem value="memory_care">Memory Care</SelectItem>
                  <SelectItem value="independent_living">Independent Living</SelectItem>
                  <SelectItem value="nursing_home">Nursing Home</SelectItem>
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
          ) : facilities.length === 0 ? (
            <div className="text-center py-10">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No facilities found</h3>
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
                    <TableHead>Location</TableHead>
                    <TableHead>Care Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Spots Available</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Featured</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">
                        {facility.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {facility.location || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {facility.care_type?.replace('_', ' ') || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(facility.status)}>
                          {facility.status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {facility.spots_available || 0}
                        </div>
                      </TableCell>
                      <TableCell>{facility.price_range || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={facility.featured ? 'default' : 'secondary'}>
                          {facility.featured ? 'Featured' : 'Standard'}
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

export default FacilitiesReports;