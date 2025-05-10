
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MembershipBadge from "@/components/common/MembershipBadge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AreaChart,
  Calendar,
  CircleDollarSign,
  HeartPulse,
  MapPin,
  PiggyBank,
  ShieldCheck,
  Star,
  Timer,
  User,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useRewards } from "@/hooks/useRewards";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';

// Mock data
const upcomingAppointments = [
  {
    id: 1,
    type: "Wellness Check",
    provider: "Dr. Emily Johnson",
    date: "2025-05-20",
    time: "10:00 AM",
    location: "Downtown Medical Center",
  },
];

const healthMetrics = [
  { name: "Blood Pressure", value: "120/80", status: "normal" },
  { name: "Heart Rate", value: "72 bpm", status: "normal" },
  { name: "Blood Glucose", value: "110 mg/dL", status: "elevated" },
  { name: "Cholesterol", value: "190 mg/dL", status: "normal" },
  { name: "BMI", value: "24.5", status: "normal" },
];

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { rewards, points, isLoading: rewardsLoading } = useRewards();
  const { profile, membershipTier } = useAuth();
  
  // Get user name from profile or use default
  const userName = profile?.full_name || "Member";
  
  // Use membershipTier from auth context or default to "smart"
  const userMembership = membershipTier || "smart";
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}</h1>
          <p className="text-muted-foreground">Here's what's happening with your health today.</p>
        </div>
        <div className="flex items-center gap-2">
          <MembershipBadge type={userMembership} size="lg" />
          <Button variant="outline" onClick={() => navigate('/dashboard/membership')}>View Benefits</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        {/* Left column - membership & rewards */}
        <div className="md:col-span-2 space-y-6">
          {/* Membership card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Membership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Tier</p>
                  <div className="flex items-center gap-2">
                    <MembershipBadge type={userMembership} />
                    <span className="font-semibold capitalize">{userMembership}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/membership')}>
                  Upgrade
                </Button>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Benefits Used</p>
                <Progress value={45} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>3 of 7 benefits used</span>
                  <span>45%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Points</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">
                      {rewardsLoading ? '...' : points?.current || 0}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/rewards')}>
                  Redeem
                </Button>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Referral Status</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {rewardsLoading ? 'Loading...' : `${points?.referrals || 0} of 5 referrals`}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigate('/dashboard/share-and-earn')}
                  >
                    Invite
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - tabs content */}
        <div className="md:col-span-4">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
            <TabsContent value="appointments" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{appointment.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.provider}
                            </p>
                            <div className="flex gap-4 mt-1 text-sm">
                              <span className="flex items-center gap-1">
                                <Timer className="h-3 w-3" />
                                {new Date(
                                  `${appointment.date}T${appointment.time}`
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(appointment.date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {appointment.location}
                              </span>
                            </div>
                          </div>
                          <Button size="sm">Details</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-medium mb-1">No upcoming appointments</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Schedule your next healthcare appointment
                      </p>
                      <Button onClick={() => navigate("/dashboard/appointments")}>
                        Book Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/dashboard/appointments")}
                  >
                    View All Appointments
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Primary Care Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Dr. Michael Chen</h4>
                      <p className="text-sm text-muted-foreground">
                        Primary Care Physician
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Contact
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/dashboard/messages")}
                  >
                    Message Care Team
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-primary" />
                    Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {healthMetrics.map((metric, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div>
                          <h4 className="font-medium text-sm">{metric.name}</h4>
                          <p className="text-lg font-semibold">{metric.value}</p>
                        </div>
                        <Badge
                          variant={
                            metric.status === "normal"
                              ? "outline"
                              : metric.status === "elevated"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {metric.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/health-insights")}
                  >
                    View Health Insights
                  </Button>
                  <Button onClick={() => navigate("/dashboard/health-tools")}>
                    Health Tools
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Popular Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center"
                      onClick={() => navigate("/dashboard/concierge")}
                    >
                      <ShieldCheck className="h-6 w-6 mb-2" />
                      <span className="text-base font-medium">Concierge</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center"
                      onClick={() => navigate("/dashboard/pharmacy")}
                    >
                      <CircleDollarSign className="h-6 w-6 mb-2" />
                      <span className="text-base font-medium">Pharmacy</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center"
                      onClick={() =>
                        navigate("/dashboard/medical-transport")
                      }
                    >
                      <PiggyBank className="h-6 w-6 mb-2" />
                      <span className="text-base font-medium">Transport</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center"
                      onClick={() => navigate("/dashboard/vacations")}
                    >
                      <AreaChart className="h-6 w-6 mb-2" />
                      <span className="text-base font-medium">Vacations</span>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => navigate("/dashboard/service-booking")}
                  >
                    Browse All Services
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
