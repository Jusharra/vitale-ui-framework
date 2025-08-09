import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, TrendingUp, Users, CreditCard, Download, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface EarningsData {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  oneTimePayments: number;
  partnerRevenue: number;
  activeSubscriptions: number;
  growthRate: number;
}

interface RevenueBreakdown {
  source: string;
  amount: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  revenue: number;
  subscriptions: number;
  oneTime: number;
}

const AdminEarnings = () => {
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalRevenue: 0,
    monthlyRecurringRevenue: 0,
    oneTimePayments: 0,
    partnerRevenue: 0,
    activeSubscriptions: 0,
    growthRate: 0
  });

  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [marketOrders, setMarketOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch subscription data
      const { data: subscriptionsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;

      // Fetch payment data (legacy one-time payments)
      const { data: paymentsData, error: payError } = await supabase
        .from('payment_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (payError) throw payError;

      // Fetch marketplace orders (new one-time payments)
      const { data: marketOrdersData, error: marketErr } = await supabase
        .from('marketplace_orders')
        .select('*')
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(100);

      if (marketErr) throw marketErr;

      // Fetch partner platform subscriptions
      const { data: partnerSubs, error: partnerError } = await supabase
        .from('partner_platform_subscriptions')
        .select('*');

      if (partnerError) throw partnerError;

      // Calculate metrics
      const activeSubscriptions = subscriptionsData?.filter(sub => sub.status === 'active') || [];
      const monthlyRecurringRevenue = activeSubscriptions.reduce((total, sub) => {
        const tierPricing = {
          'smart': 29,
          'core': 99,
          'vip': 199
        };
        return total + (tierPricing[sub.tier as keyof typeof tierPricing] || 0);
      }, 0);

      const paymentsCents = (paymentsData?.reduce((total, payment) => 
        payment.status === 'succeeded' ? total + (payment.amount || 0) : total, 0) || 0);
      const marketplaceCents = (marketOrdersData?.reduce((total, order) => total + (order.amount_cents || 0), 0) || 0);
      const totalRevenue = (paymentsCents + marketplaceCents) / 100;

      const oneTimePayments = (paymentsData?.length || 0) + (marketOrdersData?.length || 0);
      
      const partnerRevenue = partnerSubs?.filter(sub => sub.status === 'active').length * 99 || 0;

      setEarningsData({
        totalRevenue,
        monthlyRecurringRevenue,
        oneTimePayments,
        partnerRevenue,
        activeSubscriptions: activeSubscriptions.length,
        growthRate: 12.5 // Placeholder for now
      });

      // Set breakdown data
      setRevenueBreakdown([
        { source: 'Member Subscriptions', amount: monthlyRecurringRevenue, percentage: 60 },
        { source: 'One-time Payments', amount: (paymentsCents + marketplaceCents) / 100, percentage: 25 },
        { source: 'Partner Revenue', amount: partnerRevenue, percentage: 15 }
      ]);

      // Generate monthly trends (mock data for now)
      setMonthlyTrends([
        { month: 'Jan', revenue: 12500, subscriptions: 8500, oneTime: 4000 },
        { month: 'Feb', revenue: 15200, subscriptions: 9800, oneTime: 5400 },
        { month: 'Mar', revenue: 18100, subscriptions: 11200, oneTime: 6900 },
        { month: 'Apr', revenue: 21300, subscriptions: 13100, oneTime: 8200 },
        { month: 'May', revenue: 24800, subscriptions: 15600, oneTime: 9200 },
        { month: 'Jun', revenue: 28500, subscriptions: 18200, oneTime: 10300 }
      ]);

      setSubscriptions(subscriptionsData || []);
      setPayments(paymentsData || []);
      setMarketOrders(marketOrdersData || []);

    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch earnings data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{earningsData.growthRate}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.monthlyRecurringRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {earningsData.activeSubscriptions} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsData.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              +12 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.partnerRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From platform subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Revenue distribution by source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                  label={({ source, percentage }) => `${source}: ${percentage}%`}
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Management Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="payments">One-Time Payments</TabsTrigger>
            <TabsTrigger value="partners">Partner Revenue</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchEarningsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>All current active member subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Period End</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.slice(0, 10).map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-mono text-sm">
                        {subscription.user_id?.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscription.tier === 'vip' ? 'default' : 'secondary'}>
                          {subscription.tier?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {subscription.current_period_end ? 
                          new Date(subscription.current_period_end).toLocaleDateString() : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          subscription.tier === 'smart' ? 29 :
                          subscription.tier === 'core' ? 99 :
                          subscription.tier === 'vip' ? 199 : 0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>All one-time payments and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.slice(0, 10).map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.stripe_payment_id?.slice(0, 12)}...
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {payment.user_id?.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {formatCurrency((payment.amount || 0) / 100)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={payment.status === 'succeeded' ? 'default' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partner Platform Subscriptions</CardTitle>
              <CardDescription>Revenue from partner platform subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Partner revenue tracking will be displayed here once data is available.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEarnings;