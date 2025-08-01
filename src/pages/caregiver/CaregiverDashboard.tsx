import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CaregiverSubscriptionCard from '@/components/caregiver/CaregiverSubscriptionCard';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, Clock, XCircle, Heart, Users, Calendar } from 'lucide-react';

export default function CaregiverDashboard() {
  const { profile } = useAuth();

  const getVettingStatusDisplay = () => {
    switch (profile?.vetting_status) {
      case 'approved':
        return {
          icon: <CheckCircle className="w-5 h-5 text-success" />,
          text: 'Approved',
          badge: <Badge variant="default" className="bg-success text-success-foreground">Approved</Badge>
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-5 h-5 text-destructive" />,
          text: 'Not Approved',
          badge: <Badge variant="destructive">Not Approved</Badge>
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          text: 'Under Review',
          badge: <Badge variant="secondary">Under Review</Badge>
        };
    }
  };

  const vettingStatus = getVettingStatusDisplay();

  return (
    <Layout role="caregiver">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Caregiver Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {profile?.full_name}! Manage your caregiver profile and directory listing.
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Application Status</CardTitle>
              {vettingStatus.icon}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{vettingStatus.text}</span>
                {vettingStatus.badge}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Directory Listing</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.directory_listing ? 'Active' : 'Inactive'}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile?.directory_listing 
                  ? 'Families can find you' 
                  : 'Not visible to families'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Experience</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.years_experience || 0} years
              </div>
              <p className="text-xs text-muted-foreground">
                Professional experience
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Management */}
          <CaregiverSubscriptionCard />

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.specialties && profile.specialties.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.certifications && profile.certifications.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.hourly_rate && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Hourly Rate</h4>
                  <p className="text-lg font-semibold">${profile.hourly_rate}/hour</p>
                </div>
              )}

              {profile?.bio && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Bio</h4>
                  <p className="text-sm">{profile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-medium">Update Profile</h4>
                  <p className="text-sm text-muted-foreground">Edit your skills and experience</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <Calendar className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-medium">Manage Availability</h4>
                  <p className="text-sm text-muted-foreground">Update your schedule</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <Heart className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-medium">View Directory</h4>
                  <p className="text-sm text-muted-foreground">See your public profile</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}