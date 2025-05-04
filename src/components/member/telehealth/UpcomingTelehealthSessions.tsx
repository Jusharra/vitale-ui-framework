import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isToday } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useAccessCheck } from "@/hooks/useToolAccess";
import { Skeleton } from "@/components/ui/skeleton";

interface TelehealthSession {
  id: string;
  partner: {
    id: string;
    name: string;
    practice_name?: string;
    profile_image?: string;
  };
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  session_url: string;
  appointment_id?: string;
}

const UpcomingTelehealthSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, user } = useAuth();
  const { hasAccess } = useAccessCheck(user?.id || null, 'telehealth');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        if (!profile) return;
        
        const { data, error } = await supabase
          .from('telehealth_session')
          .select(`
            id, scheduled_start, scheduled_end, status, session_url, appointment_id,
            partner:partner_id (id, name, practice_name, profile_image)
          `)
          .eq('member_id', profile.id)
          .eq('status', 'scheduled')
          .gt('scheduled_start', new Date().toISOString())
          .order('scheduled_start');
        
        if (error) throw error;
        
        setSessions(data || []);
      } catch (error) {
        console.error('Error fetching telehealth sessions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your upcoming telehealth sessions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [profile]);

  const joinSession = (sessionUrl: string) => {
    window.open(sessionUrl, '_blank');
  };

  const cancelSession = async (sessionId: string) => {
    try {
      // Update the session status to cancelled
      const { error } = await supabase
        .from('telehealth_session')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      toast({
        title: 'Session Cancelled',
        description: 'Your telehealth session has been cancelled successfully.'
      });
      
      // Remove the session from the list
      setSessions(sessions.filter(session => session.id !== sessionId));
      
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel your telehealth session',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <SessionsLoadingSkeleton />;
  }

  if (!hasAccess) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <CardTitle>Premium Feature: Telehealth</CardTitle>
          <CardDescription>
            Video consultations with healthcare providers are available to VIP members only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upgrade to VIP Executive</h3>
            <p className="text-muted-foreground mb-4">
              Get access to on-demand telehealth consultations with your healthcare providers.
            </p>
            <Button>Upgrade Membership</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Telehealth Sessions</CardTitle>
          <CardDescription>
            You don't have any upcoming telehealth sessions scheduled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Upcoming Sessions</h3>
            <p className="text-muted-foreground mb-4">
              You can schedule a telehealth session with any of your providers who support virtual care.
            </p>
            <Button>Schedule a Session</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => {
        const sessionDate = new Date(session.scheduled_start);
        const isUpcoming = isToday(sessionDate) && new Date() < sessionDate;
        
        return (
          <Card key={session.id} className={isUpcoming ? "border-primary/50" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    Session with {session.partner?.name || "Provider"}
                    {isUpcoming && <Badge className="ml-2 bg-primary/20 text-primary">Today</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {session.partner?.practice_name || "Independent Practice"}
                  </CardDescription>
                </div>
                <Badge>{session.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(session.scheduled_start), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(session.scheduled_start), "h:mm a")} - 
                    {format(new Date(session.scheduled_end), "h:mm a")}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => cancelSession(session.id)}
              >
                <AlertCircle className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={() => joinSession(session.session_url)}
                disabled={!isUpcoming}
              >
                <Video className="h-4 w-4" />
                {isUpcoming ? "Join Now" : "Join at Scheduled Time"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

const SessionsLoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2].map(i => (
      <Card key={i}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default UpcomingTelehealthSessions;
