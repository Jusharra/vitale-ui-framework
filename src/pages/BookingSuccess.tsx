import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Calendar, Users, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BookingDetails {
  booking_reference: string;
  package_name: string;
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_amount: number;
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_vacation_booking_by_session', {
          p_session_id: sessionId,
        });

        if (error) throw error;
        const row = Array.isArray(data) ? data[0] : data;
        setBooking(row as BookingDetails);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Booking not found</p>
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              <p className="text-muted-foreground">
                Your vacation booking has been successfully confirmed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Booking Reference:</span>
                    <p className="font-mono text-lg">{booking.booking_reference}</p>
                  </div>
                  <div>
                    <span className="font-medium">Total Paid:</span>
                    <p className="text-lg font-semibold text-primary">
                      ${booking.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.package_name}</p>
                    <p className="text-sm text-muted-foreground">Vacation Package</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Travel Dates</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.number_of_guests} Guest(s)</p>
                    <p className="text-sm text-muted-foreground">For {booking.guest_name}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Confirmation
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/member/vacations">View My Bookings</Link>
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>A confirmation email has been sent to your registered email address.</p>
                <p className="mt-2">
                  Need help? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BookingSuccess;