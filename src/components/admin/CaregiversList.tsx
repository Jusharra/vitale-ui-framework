import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Caregiver {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  vetting_status: 'pending' | 'approved' | 'rejected';
  directory_listing: boolean;
  specialties?: string[];
  hourly_rate?: number;
  years_experience?: number;
  certifications?: string[];
  created_at: string;
}

interface CaregiversListProps {
  caregivers: Caregiver[];
  onRefresh: () => void;
}

export default function CaregiversList({ caregivers, onRefresh }: CaregiversListProps) {
  const { toast } = useToast();

  const handleVettingAction = async (caregiverId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          vetting_status: action,
          updated_at: new Date().toISOString()
        })
        .eq('id', caregiverId);

      if (error) throw error;

      toast({
        title: `Caregiver ${action}`,
        description: `The caregiver has been ${action} successfully.`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error updating vetting status:', error);
      toast({
        title: "Error",
        description: "Failed to update caregiver status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVettingStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CG';
  };

  return (
    <div className="space-y-4">
      {caregivers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No caregivers found</p>
          </CardContent>
        </Card>
      ) : (
        caregivers.map((caregiver) => (
          <Card key={caregiver.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={caregiver.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(caregiver.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{caregiver.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{caregiver.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getVettingStatusBadge(caregiver.vetting_status)}
                  {caregiver.directory_listing && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <DollarSign className="w-3 h-3 mr-1" />Listed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Experience</h4>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span>{caregiver.years_experience || 0} years</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Hourly Rate</h4>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>${caregiver.hourly_rate || 'Not set'}/hour</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Applied</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(caregiver.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {caregiver.specialties && caregiver.specialties.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {caregiver.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {caregiver.certifications && caregiver.certifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {caregiver.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {caregiver.vetting_status === 'pending' && (
                <div className="flex space-x-2 pt-2 border-t">
                  <Button
                    size="sm"
                    onClick={() => handleVettingAction(caregiver.id, 'approved')}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleVettingAction(caregiver.id, 'rejected')}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}