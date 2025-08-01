import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

export default function CaregiverSubscriptionCancelled() {
  return (
    <Layout role="caregiver">
      <div className="container mx-auto py-12 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl text-amber-600">Subscription Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Your subscription process was cancelled. No charges have been made to your payment method.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Why Subscribe to Our Directory?</h3>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">Get discovered by families seeking quality care</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">Showcase your skills and experience professionally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">Access our secure messaging and scheduling tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">Join a trusted network of verified caregivers</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                All for just <strong>$25/month</strong> - that's less than one hour of work!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/caregiver/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                💚 Ready to Start Earning?
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                Our caregivers typically earn back their subscription fee within the first few hours of work. 
                Start building your client base today!
              </p>
              <Button asChild className="w-full">
                <Link to="/caregiver/dashboard">
                  Try Again - Subscribe Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}