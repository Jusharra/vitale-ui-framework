
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface TelehealthSession {
  id: string;
  partner: {
    id: string;
    name: string;
    practice_name?: string;
  };
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  status: string;
  notes?: string;
}

const TelehealthHistory = () => {
  const [sessions, setSessions] = useState<TelehealthSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        if (!profile) return;
        
        const { data, error } = await supabase
          .from('telehealth_session')
          .select(`
            id, scheduled_start, scheduled_end, actual_start, actual_end, status, notes,
            partner:partner_id (id, name, practice_name)
          `)
          .eq('member_id', profile.id)
          .in('status', ['completed', 'cancelled', 'no_show'])
          .order('scheduled_start', { ascending: false });
        
        if (error) throw error;
        
        setSessions(data || []);
      } catch (error) {
        console.error('Error fetching telehealth history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your telehealth history',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [profile]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'outline';
      case 'no_show':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const requestSessionSummary = (sessionId: string) => {
    toast({
      title: 'Summary Requested',
      description: 'We will email you the session summary shortly.',
    });
  };

  if (isLoading) {
    return <SessionHistoryLoadingSkeleton />;
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telehealth Session History</CardTitle>
          <CardDescription>
            Your past telehealth sessions will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Session History</h3>
            <p className="text-muted-foreground mb-4">
              Once you complete telehealth sessions, they will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  Session with {session.partner?.name || "Provider"}
                </CardTitle>
                <CardDescription>
                  {session.partner?.practice_name || "Independent Practice"}
                </CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(session.status)}>
                {session.status === 'completed' ? 'Completed' : 
                 session.status === 'cancelled' ? 'Cancelled' : 'No Show'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(session.scheduled_start), "EEEE, MMMM d, yyyy")} 
                  ({formatDistanceToNow(new Date(session.scheduled_start), { addSuffix: true })})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(session.scheduled_start), "h:mm a")} - 
                  {format(new Date(session.scheduled_end), "h:mm a")}
                </span>
              </div>
              
              {session.notes && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Provider Notes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
          {session.status === 'completed' && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => requestSessionSummary(session.id)}
              >
                <Download className="h-4 w-4" />
                Request Summary
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

const SessionHistoryLoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map(i => (
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
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-40" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default TelehealthHistory;
