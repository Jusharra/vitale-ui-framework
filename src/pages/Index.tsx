
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
              <span className="text-primary-foreground text-lg font-bold">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Vitale Health Concierge</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium">Home</Link>
            <Link to="/" className="text-sm font-medium">Membership</Link>
            <Link to="/" className="text-sm font-medium">Services</Link>
            <Link to="/" className="text-sm font-medium">About</Link>
            <Link to="/" className="text-sm font-medium">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard">Member Login</Link>
            </Button>
            <Button asChild>
              <Link to="/">Join Now</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Welcome to Vitale Health Concierge
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Your premium healthcare concierge service with personalized care and exclusive benefits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" asChild>
              <Link to="/dashboard">Access Dashboard</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/">Explore Membership Plans</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-membership-smart-bg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-membership-smart-text font-bold">S</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Smart Access</h3>
                <p className="text-muted-foreground">Basic healthcare concierge support and digital health tools</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-membership-core-bg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-membership-core-text font-bold">C</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Core Concierge</h3>
                <p className="text-muted-foreground">Enhanced access and priority services for your healthcare needs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-membership-vip-bg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-membership-vip-text font-bold">V</span>
                </div>
                <h3 className="text-lg font-bold mb-2">VIP Executive</h3>
                <p className="text-muted-foreground">Premium healthcare experience with exclusive VIP benefits</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Role Selection for Demo */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Access Role-Based Dashboards</h2>
          <p className="text-muted-foreground text-center mb-8">
            For demonstration purposes, you can access the different role dashboards directly:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button asChild variant="outline" size="lg" className="h-auto py-6">
              <Link to="/dashboard">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium">Member</span>
                  <span className="text-sm text-muted-foreground">Patient Dashboard</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto py-6">
              <Link to="/dashboard/professional">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium">Professional</span>
                  <span className="text-sm text-muted-foreground">Provider Portal</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto py-6">
              <Link to="/dashboard/admin">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium">Admin</span>
                  <span className="text-sm text-muted-foreground">System Management</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-primary rounded-md w-6 h-6 flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">V</span>
              </div>
              <span className="text-sm font-bold">Vitale Health Concierge</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Vitale Health. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
