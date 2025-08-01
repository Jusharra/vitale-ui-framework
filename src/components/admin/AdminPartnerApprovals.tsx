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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Eye, Search, Clock, UserCheck, UserX, MapPin, Star, Briefcase, FileText, MessageSquare, Info, AlertTriangle, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  profile_id: string;
  partner_id?: string;
  status: string;
  source?: string;
  first_contact_date?: string;
  last_contact_date?: string;
  next_follow_up?: string;
  conversion_date?: string;
  notes?: string;
  metadata?: any;
  application_type: string;
  education?: any[];
  work_history?: any[];
  certifications?: any[];
  licenses?: any[];
  professional_references?: any[];
  insurance_info?: any;
  service_areas?: string[];
  detailed_bio?: string;
  uploaded_documents?: any[];
  admin_notes?: string;
  info_requests?: any[];
  last_status_change?: string;
  reviewed_by?: string;
  application_score: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    first_name?: string;
    email?: string;
    phone?: string;
    role: string;
    avatar_url?: string;
  };
}

const AdminPartnerApprovals: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [infoRequest, setInfoRequest] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'under_review' | 'info_requested'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partner_leads')
        .select(`
          *,
          profiles:profile_id (
            full_name,
            first_name,
            email,
            phone,
            role,
            avatar_url
          )
        `)
        .in('status', ['submitted', 'under_review', 'info_requested', 'resubmitted'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data || []) as unknown as Application[]);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      setActionLoading(true);
      const application = applications.find(a => a.id === applicationId);
      if (!application) return;

      const updateData: any = {
        status: newStatus,
        reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        admin_notes: notes || adminNotes,
        last_status_change: new Date().toISOString(),
      };

      // If approving, create partner record
      if (newStatus === 'approved' && application.profiles?.role === 'partner') {
        const { data: existingPartner } = await supabase
          .from('partners')
          .select('id')
          .eq('user_id', application.profile_id)
          .maybeSingle();

        if (!existingPartner) {
          const { error: partnerError } = await supabase
            .from('partners')
            .insert({
              user_id: application.profile_id,
              name: application.profiles?.full_name || application.profiles?.first_name || 'Unknown',
              phone: application.profiles?.phone,
              email: application.profiles?.email,
              status: 'active',
              verified: true,
              accepting_new_patients: true,
              bio: application.detailed_bio,
              specialties: application.service_areas,
            });

          if (partnerError) throw partnerError;
        }

        // Update profile vetting status
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ vetting_status: 'approved' })
          .eq('id', application.profile_id);

        if (profileError) throw profileError;
      }

      const { error } = await supabase
        .from('partner_leads')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Application ${newStatus} successfully`,
      });

      fetchApplications();
      setSelectedApplication(null);
      setAdminNotes('');
      setInfoRequest('');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestInfo = async (applicationId: string, request: string) => {
    try {
      setActionLoading(true);
      const application = applications.find(a => a.id === applicationId);
      if (!application) return;

      const newRequest = {
        id: Date.now().toString(),
        request,
        requested_at: new Date().toISOString(),
        requested_by: (await supabase.auth.getUser()).data.user?.id,
        status: 'pending'
      };

      const updatedRequests = [...(application.info_requests || []), newRequest];

      const { error } = await supabase
        .from('partner_leads')
        .update({
          status: 'info_requested',
          info_requests: updatedRequests,
          admin_notes: adminNotes,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          last_status_change: new Date().toISOString(),
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: 'Information Requested',
        description: 'Request sent to applicant successfully',
      });

      fetchApplications();
      setSelectedApplication(null);
      setInfoRequest('');
      setAdminNotes('');
    } catch (error) {
      console.error('Error requesting information:', error);
      toast({
        title: 'Error',
        description: 'Failed to send information request',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const name = app.profiles?.full_name || app.profiles?.first_name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500';
      case 'under_review': return 'bg-yellow-500';
      case 'info_requested': return 'bg-orange-500';
      case 'resubmitted': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const ApplicationCard = ({ application }: { application: Application }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={application.profiles?.avatar_url} />
            <AvatarFallback>
              {getInitials(application.profiles?.full_name || application.profiles?.first_name || 'Unknown')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">
                {application.profiles?.full_name || application.profiles?.first_name || 'Unknown'}
              </h3>
              <Badge variant={application.profiles?.role === 'partner' ? 'default' : 'secondary'}>
                {application.profiles?.role}
              </Badge>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(application.status)}`} />
            </div>
            
            {application.profiles?.email && (
              <p className="text-muted-foreground text-sm mb-2">{application.profiles.email}</p>
            )}
            
            {application.service_areas && application.service_areas.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {application.service_areas.slice(0, 3).map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
                {application.service_areas.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{application.service_areas.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
              <span>Score: {application.application_score}/100</span>
              {application.info_requests && application.info_requests.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {application.info_requests.length} requests
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApplication(application);
                    setAdminNotes(application.admin_notes || '');
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(application.id, 'approved')}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleStatusUpdate(application.id, 'rejected')}
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
          <h1 className="text-3xl font-bold">Application Reviews</h1>
          <p className="text-muted-foreground">
            Review and manage partner and caregiver applications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            {filteredApplications.length} pending
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
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="submitted">
              New ({applications.filter(a => a.status === 'submitted').length})
            </TabsTrigger>
            <TabsTrigger value="under_review">
              Review ({applications.filter(a => a.status === 'under_review').length})
            </TabsTrigger>
            <TabsTrigger value="info_requested">
              Info Req. ({applications.filter(a => a.status === 'info_requested').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              No applications match your current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map(application => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}

      {/* Application Detail Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                Review {selectedApplication.profiles?.role === 'partner' ? 'Partner' : 'Caregiver'} Application
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedApplication.profiles?.avatar_url} />
                        <AvatarFallback>
                          {getInitials(selectedApplication.profiles?.full_name || selectedApplication.profiles?.first_name || 'Unknown')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <div>
                          <Label className="text-sm font-semibold">Name</Label>
                          <p>{selectedApplication.profiles?.full_name || selectedApplication.profiles?.first_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Email</Label>
                          <p>{selectedApplication.profiles?.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Phone</Label>
                          <p>{selectedApplication.profiles?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Role</Label>
                          <Badge>{selectedApplication.profiles?.role}</Badge>
                        </div>
                      </div>
                    </div>

                    {selectedApplication.detailed_bio && (
                      <div>
                        <Label className="text-sm font-semibold">Bio</Label>
                        <p className="mt-1 text-sm">{selectedApplication.detailed_bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Professional Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedApplication.service_areas && selectedApplication.service_areas.length > 0 && (
                      <div>
                        <Label className="text-sm font-semibold">Service Areas</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedApplication.service_areas.map((area, index) => (
                            <Badge key={index} variant="outline">{area}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedApplication.certifications && selectedApplication.certifications.length > 0 && (
                      <div>
                        <Label className="text-sm font-semibold">Certifications</Label>
                        <div className="space-y-2 mt-1">
                          {selectedApplication.certifications.map((cert: any, index) => (
                            <div key={index} className="p-2 border rounded">
                              <p className="font-medium">{cert.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Issued: {cert.issued_date} | Expires: {cert.expiry_date}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedApplication.work_history && selectedApplication.work_history.length > 0 && (
                      <div>
                        <Label className="text-sm font-semibold">Work History</Label>
                        <div className="space-y-2 mt-1">
                          {selectedApplication.work_history.map((work: any, index) => (
                            <div key={index} className="p-2 border rounded">
                              <p className="font-medium">{work.position} at {work.company}</p>
                              <p className="text-sm text-muted-foreground">
                                {work.start_date} - {work.end_date}
                              </p>
                              {work.description && <p className="text-sm mt-1">{work.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Documents */}
                {selectedApplication.uploaded_documents && selectedApplication.uploaded_documents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Uploaded Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedApplication.uploaded_documents.map((doc: any, index) => (
                          <div key={index} className="p-2 border rounded flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Information Requests */}
                {selectedApplication.info_requests && selectedApplication.info_requests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Information Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedApplication.info_requests.map((request: any, index) => (
                          <div key={index} className="p-3 border rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={request.status === 'pending' ? 'destructive' : 'default'}>
                                {request.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(request.requested_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{request.request}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Admin Notes Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Admin Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Add your review notes..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>

                {/* Request Information Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Request Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Describe what additional information you need from the applicant..."
                      value={infoRequest}
                      onChange={(e) => setInfoRequest(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={() => handleRequestInfo(selectedApplication.id, infoRequest)}
                      disabled={!infoRequest.trim() || actionLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Information Request
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handleStatusUpdate(selectedApplication.id, 'approved', adminNotes)}
                disabled={actionLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Application
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected', adminNotes)}
                disabled={actionLoading}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPartnerApprovals;