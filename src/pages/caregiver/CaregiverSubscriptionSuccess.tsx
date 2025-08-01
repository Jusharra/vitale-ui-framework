import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

export default function CaregiverSubscriptionSuccess() {
  useEffect(() => {
    // You might want to refresh the user's subscription status here
    // or handle any post-payment logic
  }, []);

  return (
    <Layout role="caregiver">
      <div className="container mx-auto py-12 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-2xl text-success">Subscription Activated!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Congratulations! Your caregiver directory listing is now active. 
              Families can now find and contact you for caregiving services.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <Heart className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="font-medium">Complete Your Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Add photos and detailed information to attract more families
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Calendar className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="font-medium">Set Your Availability</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep your schedule updated so families know when you're available
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Users className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="font-medium">Connect with Families</h4>
                  <p className="text-sm text-muted-foreground">
                    Respond quickly to inquiries and build lasting relationships
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/caregiver/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/caregiver-directory">
                  View Your Listing
                </Link>
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Pro Tip
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Caregivers with complete profiles and quick response times get 3x more inquiries. 
                Make sure to upload a professional photo and respond to messages within 24 hours!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}