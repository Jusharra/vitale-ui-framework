import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, DollarSign, Calendar, Heart, Users, Filter } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Layout from '@/components/layout/Layout';

// Create a simple supabase client without complex type inference
const supabase = createClient(
  "https://ogmqiiyksylbpeixhhmm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbXFpaXlrc3lsYnBlaXhoaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTU5MTMsImV4cCI6MjA1ODQzMTkxM30.s_TLRrnYQluk_hCIG8tfeUZtCSaAY6RRD2NdnEHnl6Y"
);

interface Caregiver {
  id: string;
  full_name: string;
  avatar_url?: string;
  specialties?: string[];
  hourly_rate?: number;
  years_experience?: number;
  certifications?: string[];
  bio?: string;
  availability?: any; // Using any to handle JSON data from Supabase
}

export default function CaregiverDirectory() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [filteredCaregivers, setFilteredCaregivers] = useState<Caregiver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCaregivers();
  }, []);

  useEffect(() => {
    filterCaregivers();
  }, [caregivers, searchTerm, selectedSpecialty, priceRange]);

  const fetchCaregivers = async () => {
    try {
      // Type-safe query to avoid circular dependency issues
      const response = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          first_name,
          last_name,
          avatar_url,
          phone,
          role,
          status,
          vetting_status,
          created_at,
          updated_at
        `)
        .eq('role', 'caregiver')
        .eq('vetting_status', 'approved')
        .eq('directory_listing', true)
        .order('created_at', { ascending: false });
      
      if (response.error) throw response.error;
      
      // Map the data to our interface
      const caregiverData: Caregiver[] = (response.data || []).map(profile => ({
        id: profile.id,
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || undefined,
        specialties: [], // Will be populated from other sources if needed
        hourly_rate: undefined, // Will be populated from other sources if needed
        years_experience: undefined, // Will be populated from other sources if needed
        certifications: [], // Will be populated from other sources if needed
        bio: undefined, // Will be populated from other sources if needed
        availability: undefined
      }));
      
      setCaregivers(caregiverData);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCaregivers = () => {
    let filtered = caregivers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(caregiver => 
        caregiver.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caregiver.specialties?.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        caregiver.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(caregiver => 
        caregiver.specialties?.includes(selectedSpecialty)
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(caregiver => {
        if (!caregiver.hourly_rate) return false;
        if (max) {
          return caregiver.hourly_rate >= min && caregiver.hourly_rate <= max;
        }
        return caregiver.hourly_rate >= min;
      });
    }

    setFilteredCaregivers(filtered);
  };

  const getAllSpecialties = () => {
    const allSpecialties = caregivers.flatMap(c => c.specialties || []);
    return [...new Set(allSpecialties)].sort();
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CG';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Caregiver</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our directory of vetted, professional caregivers ready to provide compassionate care for your loved ones.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter Caregivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, specialty, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {getAllSpecialties().map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="15-25">$15 - $25/hour</SelectItem>
                  <SelectItem value="25-35">$25 - $35/hour</SelectItem>
                  <SelectItem value="35-50">$35 - $50/hour</SelectItem>
                  <SelectItem value="50">$50+/hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredCaregivers.length} of {caregivers.length} caregivers
          </p>
        </div>

        {/* Caregivers Grid */}
        {filteredCaregivers.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No caregivers found</p>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaregivers.map((caregiver) => (
              <Card key={caregiver.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={caregiver.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {getInitials(caregiver.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{caregiver.full_name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{caregiver.years_experience || 0} years experience</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {caregiver.hourly_rate && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-lg">${caregiver.hourly_rate}/hour</span>
                      </div>
                    </div>
                  )}

                  {caregiver.specialties && caregiver.specialties.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {caregiver.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {caregiver.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{caregiver.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {caregiver.availability && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Availability</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">{caregiver.availability.hours}</span>
                      </div>
                    </div>
                  )}

                  {caregiver.bio && (
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {caregiver.bio}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button className="flex-1">
                      <Users className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}