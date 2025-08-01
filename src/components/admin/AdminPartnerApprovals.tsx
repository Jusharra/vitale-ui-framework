import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Eye, Search, Clock, UserCheck, UserX, MapPin, Star, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PendingProfile {
  id: string;
  full_name?: string;
  first_name?: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  vetting_status: string;
  created_at: string;
  bio?: string;
  // Caregiver-specific fields
  specialties?: string[];
  years_experience?: number;
  hourly_rate?: number;
  certifications?: string[];
  directory_listing?: boolean;
  availability?: any;
  assigned_partner_id?: string;
  updated_at?: string;
}

const AdminPartnerApprovals: React.FC = () => {
  const [pendingProfiles, setPendingProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<PendingProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'partner' | 'caregiver'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const fetchPendingProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('vetting_status', 'pending')
        .in('role', ['partner', 'caregiver'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingProfiles((data || []) as PendingProfile[]);
    } catch (error) {
      console.error('Error fetching pending profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending approvals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (profileId: string, approve: boolean) => {
    try {
      setActionLoading(true);
      const profile = pendingProfiles.find(p => p.id === profileId);
      if (!profile) return;

      // Update vetting status in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          vetting_status: approve ? 'approved' : 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId);

      if (profileError) throw profileError;

      // If approving a partner, create partner record if it doesn't exist
      if (approve && profile.role === 'partner') {
        const { data: existingPartner } = await supabase
          .from('partners')
          .select('id')
          .eq('id', profileId)
          .single();

        if (!existingPartner) {
          const { error: partnerError } = await supabase
            .from('partners')
            .insert({
              id: profileId,
              name: profile.full_name || profile.first_name || 'Unknown',
              phone: profile.phone,
              status: 'active',
              verified: true,
              accepting_new_patients: true,
            });

          if (partnerError) throw partnerError;
        } else {
          // Update existing partner to active status
          const { error: updateError } = await supabase
            .from('partners')
            .update({
              status: 'active',
              verified: true,
            })
            .eq('id', profileId);

          if (updateError) throw updateError;
        }
      }

      toast({
        title: approve ? 'Approved' : 'Rejected',
        description: `${profile.full_name} has been ${approve ? 'approved' : 'rejected'} successfully`,
      });

      // Refresh the list
      fetchPendingProfiles();
      setSelectedProfile(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update approval status',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProfiles = pendingProfiles.filter(profile => {
    const name = profile.full_name || profile.first_name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || profile.role === filter;
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const ProfileCard = ({ profile }: { profile: PendingProfile }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>{getInitials(profile.full_name || profile.first_name || 'Unknown')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{profile.full_name || profile.first_name || 'Unknown'}</h3>
              <Badge variant={profile.role === 'partner' ? 'default' : 'secondary'}>
                {profile.role}
              </Badge>
            </div>
            
            {profile.phone && (
              <p className="text-muted-foreground text-sm mb-2">{profile.phone}</p>
            )}
            
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {profile.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {profile.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.specialties.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {profile.years_experience && (
              <p className="text-sm text-muted-foreground">
                {profile.years_experience} years experience
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              Applied: {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Button
              size="sm"
              onClick={() => handleApproval(profile.id, true)}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleApproval(profile.id, false)}
              disabled={actionLoading}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partner Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve pending partner and caregiver applications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            {filteredProfiles.length} pending
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All ({pendingProfiles.length})</TabsTrigger>
            <TabsTrigger value="partner">
              Partners ({pendingProfiles.filter(p => p.role === 'partner').length})
            </TabsTrigger>
            <TabsTrigger value="caregiver">
              Caregivers ({pendingProfiles.filter(p => p.role === 'caregiver').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Profiles List */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading pending approvals...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
            <p className="text-muted-foreground">
              All applications have been reviewed or no new applications are pending.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProfiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {/* Profile Detail Dialog */}
      {selectedProfile && (
        <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Review {selectedProfile.role === 'partner' ? 'Partner' : 'Caregiver'} Application
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedProfile.avatar_url} />
                  <AvatarFallback>{getInitials(selectedProfile.full_name || selectedProfile.first_name || 'Unknown')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedProfile.full_name || selectedProfile.first_name || 'Unknown'}</h3>
                  {selectedProfile.phone && (
                    <p className="text-muted-foreground">{selectedProfile.phone}</p>
                  )}
                  <Badge className="mt-2">
                    {selectedProfile.role}
                  </Badge>
                </div>
              </div>

              {selectedProfile.specialties && selectedProfile.specialties.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold">Specialties</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProfile.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedProfile.role === 'caregiver' && (
                <div className="space-y-4">
                  {selectedProfile.years_experience && (
                    <div>
                      <Label className="text-sm font-semibold">Years of Experience</Label>
                      <p className="mt-1">{selectedProfile.years_experience} years</p>
                    </div>
                  )}
                  
                  {selectedProfile.hourly_rate && (
                    <div>
                      <Label className="text-sm font-semibold">Hourly Rate</Label>
                      <p className="mt-1">${selectedProfile.hourly_rate}/hour</p>
                    </div>
                  )}
                  
                  {selectedProfile.certifications && (
                    <div>
                      <Label className="text-sm font-semibold">Certifications</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedProfile.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedProfile.bio && (
                <div>
                  <Label className="text-sm font-semibold">Bio</Label>
                  <p className="mt-1 text-sm">{selectedProfile.bio}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleApproval(selectedProfile.id, true)}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={() => handleApproval(selectedProfile.id, false)}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPartnerApprovals;