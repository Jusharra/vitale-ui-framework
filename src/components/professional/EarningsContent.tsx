
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, WalletIcon, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformSubscriptionCard from './PlatformSubscriptionCard';

// Mock data
const recentPayouts = [
  { id: 1, date: "2025-05-01", amount: 1250.00, status: "completed", patients: 8 },
  { id: 2, date: "2025-04-15", amount: 980.50, status: "completed", patients: 6 },
  { id: 3, date: "2025-04-01", amount: 1450.75, status: "completed", patients: 10 },
];

const pendingPayments = [
  { id: 101, date: "2025-05-15", amount: 450.00, status: "pending", patientName: "Sarah Johnson" },
  { id: 102, date: "2025-05-14", amount: 350.00, status: "pending", patientName: "Michael Rodriguez" },
  { id: 103, date: "2025-05-10", amount: 175.50, status: "processing", patientName: "Emily Chang" },
];

const EarningsContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings Dashboard</h1>
          <p className="text-muted-foreground">Manage your payments and financial information</p>
        </div>
        <div className="space-x-2">
          <Button>Connect Stripe Account</Button>
          <Button variant="outline">Download Statement</Button>
        </div>
      </div>

      {/* Platform Subscription Card */}
      <PlatformSubscriptionCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">$3,680.25</CardTitle>
            <CardDescription>Total Earnings (Last 30 Days)</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">$975.50</CardTitle>
            <CardDescription>Pending Payments</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <PiggyBank className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">24</CardTitle>
            <CardDescription>Patient Appointments</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
          <CardDescription>Your completed Stripe Connect payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>{payout.patients} patients</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>Patient payments in process</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.patientName}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={payment.status === "pending" 
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-muted rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center">
            <PiggyBank className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Need help with payments?</h3>
            <p className="text-sm text-muted-foreground">Our support team can help you set up your Stripe Connect account</p>
          </div>
        </div>
        <Button>Contact Support</Button>
      </div>
    </div>
  );
};

export default EarningsContent;
