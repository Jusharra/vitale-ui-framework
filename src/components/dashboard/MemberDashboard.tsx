import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FeatureCard from '../common/FeatureCard';
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  Tag, 
  User, 
  Users, 
  Video, 
  MapPin, 
  Activity, 
  Palmtree, 
  Ambulance, 
  Heart, 
  Gift, 
  Download,
  Award,
  Pill,
  Bell
} from 'lucide-react';
import MembershipBadge from '../common/MembershipBadge';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useRewards } from "@/hooks/useRewards";
import { Badge } from "@/components/ui/badge";

// Mock data
const upcomingAppointments = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "May 10, 2025", time: "10:30 AM" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Primary Care", date: "May 15, 2025", time: "2:00 PM" },
];

const alerts = [
  { id: 1, title: "Prescription Refill", message: "Your medication is ready for pickup", date: "May 5, 2025" },
  { id: 2, title: "Appointment Confirmation", message: "Your appointment has been confirmed", date: "May 4, 2025" },
];

const medications = [
  { id: 1, name: "Lisinopril", dosage: "10mg", refills: 3 },
  { id: 2, name: "Metformin", dosage: "500mg", refills: 1 },
];

const healthMetrics = {
  weight: { value: 168, unit: "lbs", change: -2 },
  bloodPressure: { value: "120/80", unit: "mmHg", change: 0 },
  heartRate: { value: 68, unit: "bpm", change: -5 }
};

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { rewards, isLoading } = useRewards();
  
  // Mock user data - in a real app this would come from auth context or API
  const userData = {
    name: "John Doe",
    membership: "smart" as "smart" | "core" | "vip",
    nextAppointment: upcomingAppointments[0],
    points: 2450,
    primaryDoctor: "Dr. Michael Chen",
    rewardsTier: "Silver"
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userData.name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your health today.</p>
        </div>
        <div className="flex items-center gap-2">
          <MembershipBadge type={userData.membership} size="lg" />
          <Button variant="outline" onClick={() => navigate('/dashboard/membership')}>View Benefits</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Membership Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Status</CardTitle>
            <CardDescription>Your active plan and benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Tier</p>
                  <div className="flex items-center gap-2">
                    <MembershipBadge type={userData.membership} />
                    <span className="font-semibold capitalize">{userData.membership}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/membership')}>
                  Upgrade
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Rewards Points</p>
                  <span className="text-sm font-medium">{userData.points}</span>
                </div>
                <Progress value={45} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{userData.rewardsTier} Tier</span>
                  <span>550 until Gold Tier</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium">Primary Care Team</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{userData.primaryDoctor}</p>
                    <p className="text-xs text-muted-foreground">Primary Care Physician</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" onClick={() => navigate('/dashboard/concierge')}>
              View Full Care Team
            </Button>
          </CardFooter>
        </Card>

        {/* Appointments Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b">
                    <div className="bg-primary/10 p-2 rounded-md shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <p className="text-sm mt-1">{appointment.date} at {appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming appointments</p>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/dashboard/appointments')}>Book Appointment</Button>
          </CardFooter>
        </Card>

        {/* Health Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Health Summary
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Your key health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-medium">{healthMetrics.weight.value}</p>
                    <p className="text-sm text-muted-foreground">{healthMetrics.weight.unit}</p>
                  </div>
                </div>
                <div className={`text-sm ${healthMetrics.weight.change < 0 ? 'text-green-600' : healthMetrics.weight.change > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {healthMetrics.weight.change < 0 ? '▼' : healthMetrics.weight.change > 0 ? '▲' : '●'} {Math.abs(healthMetrics.weight.change)}
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-medium">{healthMetrics.bloodPressure.value}</p>
                    <p className="text-sm text-muted-foreground">{healthMetrics.bloodPressure.unit}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Normal
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-medium">{healthMetrics.heartRate.value}</p>
                    <p className="text-sm text-muted-foreground">{healthMetrics.heartRate.unit}</p>
                  </div>
                </div>
                <div className={`text-sm ${healthMetrics.heartRate.change < 0 ? 'text-green-600' : healthMetrics.heartRate.change > 0 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  {healthMetrics.heartRate.change < 0 ? '▼' : healthMetrics.heartRate.change > 0 ? '▲' : '●'} {Math.abs(healthMetrics.heartRate.change)}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/dashboard/health-insights')}>View Full Report</Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex flex-col h-24 justify-center items-center text-center">
                    <FileText className="h-5 w-5 mb-1" />
                    <span>Request Prescription</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-24 justify-center items-center text-center" onClick={() => navigate('/dashboard/messages')}>
                    <MessageSquare className="h-5 w-5 mb-1" />
                    <span>Message Provider</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-24 justify-center items-center text-center" onClick={() => navigate('/dashboard/concierge')}>
                    <Users className="h-5 w-5 mb-1" />
                    <span>My Concierge</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-24 justify-center items-center text-center" onClick={() => navigate('/dashboard/service-booking')}>
                    <Tag className="h-5 w-5 mb-1" />
                    <span>Book Services</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Important health notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.map((alert) => (
                  <div key={alert.id} className="pb-4 mb-4 last:mb-0 last:pb-0 border-b last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium">{alert.title}</p>
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Alerts</Button>
              </CardFooter>
            </Card>
            
            {!isLoading && rewards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Redeem with your points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewards.slice(0, 2).map((reward) => (
                    <div key={reward.id} className="pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <p className="font-medium">{reward.name}</p>
                        <Badge variant={reward.status === 'available' ? 'default' : 'secondary'}>
                          {reward.value} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/share-and-earn')}>
                  View All Rewards
                </Button>
              </CardFooter>
            </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Medications Tab */}
        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                Your Medications
                <Button variant="outline" size="sm">
                  <Pill className="h-4 w-4 mr-2" />
                  Request Refill
                </Button>
              </CardTitle>
              <CardDescription>Current prescriptions and refills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="flex justify-between items-center pb-4 last:pb-0 border-b last:border-0">
                    <div>
                      <p className="font-medium">{med.name} {med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.refills} refills remaining</p>
                    </div>
                    <Button variant="outline" size="sm">Request Refill</Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/dashboard/pharmacy')}>
                Visit Pharmacy Center
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>All Health Notifications</CardTitle>
              <CardDescription>Stay informed about your health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...alerts, 
                  { id: 3, title: "Health Report Ready", message: "Your quarterly health assessment is ready to view", date: "May 3, 2025" },
                  { id: 4, title: "New Message", message: "You have a new message from Dr. Sarah Johnson", date: "May 2, 2025" },
                  { id: 5, title: "Medication Alert", message: "Time to refill your prescription for Metformin", date: "May 1, 2025" }
                ].map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center 
                      ${alert.title.includes("Prescription") ? "bg-blue-100" : 
                        alert.title.includes("Appointment") ? "bg-green-100" : 
                        alert.title.includes("Message") ? "bg-purple-100" : "bg-amber-100"}`}>
                      {alert.title.includes("Prescription") && <Pill className="h-5 w-5 text-blue-600" />}
                      {alert.title.includes("Appointment") && <Calendar className="h-5 w-5 text-green-600" />}
                      {alert.title.includes("Message") && <MessageSquare className="h-5 w-5 text-purple-600" />}
                      {!alert.title.includes("Prescription") && !alert.title.includes("Appointment") && !alert.title.includes("Message") && 
                        <Bell className="h-5 w-5 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{alert.title}</p>
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Rewards Status</CardTitle>
                <CardDescription>Current points and tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Award className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{userData.points}</h3>
                    <p className="text-sm text-muted-foreground">Available Points</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Progress to Next Tier</span>
                      <span className="text-sm text-muted-foreground">550 more needed</span>
                    </div>
                    <Progress value={45} />
                    <div className="flex justify-between mt-2">
                      <div>
                        <p className="text-sm font-medium">{userData.rewardsTier}</p>
                        <p className="text-xs text-muted-foreground">Current Tier</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Gold</p>
                        <p className="text-xs text-muted-foreground">Next Tier</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <p>Appointment Completed</p>
                        <p className="font-medium text-green-600">+100 pts</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Health Survey Completed</p>
                        <p className="font-medium text-green-600">+50 pts</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Referral Bonus</p>
                        <p className="font-medium text-green-600">+200 pts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate('/dashboard/share-and-earn')}>
                  Refer Friends to Earn
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Rewards you can redeem now</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[350px] overflow-y-auto">
                <div className="space-y-4">
                  {!isLoading && rewards.map((reward) => (
                    <div key={reward.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{reward.name}</h3>
                        <Badge variant={userData.points >= (reward.value || 0) ? 'default' : 'outline'}>
                          {reward.value} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      <div className="mt-3 flex justify-end">
                        <Button disabled={userData.points < (reward.value || 0)} size="sm">
                          Redeem
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Available Rewards
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <h2 className="text-2xl font-bold tracking-tight mt-8">Health Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          title="Health Insights"
          description="View your personalized health data and recommendations"
          icon={Activity}
          onClick={() => navigate('/dashboard/health-insights')}
        />
        <FeatureCard
          title="Symptom Checker"
          description="Check your symptoms and get recommendations"
          icon={FileText}
          onClick={() => navigate('/dashboard/health-tools')}
        />
        <FeatureCard
          title="Share & Earn"
          description="Refer friends, earn points, and unlock exclusive rewards"
          icon={Gift}
          onClick={() => navigate('/dashboard/share-and-earn')}
        />
        <FeatureCard
          title="Virtual Consultation"
          description="Connect with a healthcare provider via video"
          icon={Video}
          onClick={() => navigate('/dashboard/health-tools')}
        />
        <FeatureCard
          title="My Concierge Team"
          description="Manage your healthcare provider team and preferred pharmacy"
          icon={Users}
          onClick={() => navigate('/dashboard/concierge')}
        />
        <FeatureCard
          title="Medical Transport"
          description="Book medical transport for appointments and medical tourism"
          icon={Ambulance}
          onClick={() => navigate('/dashboard/medical-transport')}
        />
        <FeatureCard
          title="Vacation Marketplace"
          description="Explore exclusive vacation packages with tier-based pricing"
          icon={Palmtree}
          onClick={() => navigate('/dashboard/vacations')}
        />
        <FeatureCard
          title="Promotions"
          description="Exclusive health and wellness offers for members"
          icon={Tag}
          onClick={() => navigate('/dashboard/promotions')}
        />
        <FeatureCard
          title="Health Reports"
          description="Download your health reports and summaries"
          icon={Download}
          onClick={() => navigate('/dashboard/health-insights')}
        />
      </div>

      <h2 className="text-2xl font-bold tracking-tight mt-8">VIP Exclusive</h2>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
        <FeatureCard
          title="Telehealth Services"
          description="Schedule virtual sessions with your assigned healthcare partners"
          icon={Video}
          locked={userData.membership !== "vip"}
          requiresUpgrade="vip"
          onClick={() => navigate('/dashboard/telehealth')}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 border-indigo-100"
        />
      </div>

      <div className="bg-muted rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Need help with something?</h3>
            <p className="text-sm text-muted-foreground">Our AI health assistant is ready to answer your questions</p>
          </div>
        </div>
        <Button>Ask Health Assistant</Button>
      </div>
    </div>
  );
};

export default MemberDashboard;
