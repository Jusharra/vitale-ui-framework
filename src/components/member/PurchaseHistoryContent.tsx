
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Receipt, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for purchases
const purchaseData = [
  {
    id: "INV-001",
    date: "Apr 28, 2025",
    service: "Annual Physical Exam",
    provider: "Dr. Sarah Johnson",
    amount: 65.00,
    status: "completed",
    type: "medical"
  },
  {
    id: "INV-002",
    date: "Apr 15, 2025",
    service: "Microdermabrasion",
    provider: "Aesthetic Center",
    amount: 135.00,
    status: "completed",
    type: "aesthetic"
  },
  {
    id: "INV-003",
    date: "Mar 22, 2025",
    service: "Vitamin B12 Injection",
    provider: "Wellness Clinic",
    amount: 45.00,
    status: "completed",
    type: "wellness"
  },
  {
    id: "INV-004",
    date: "Mar 10, 2025",
    service: "Botox Treatment",
    provider: "Aesthetic Center",
    amount: 350.00,
    status: "completed",
    type: "aesthetic"
  },
  {
    id: "INV-005",
    date: "Feb 28, 2025",
    service: "Nutritional Consultation",
    provider: "Dr. Michael Chen",
    amount: 85.00,
    status: "completed",
    type: "wellness"
  },
  {
    id: "INV-006",
    date: "Feb 15, 2025",
    service: "Telehealth Consultation",
    provider: "Dr. Robert Williams",
    amount: 0.00,
    status: "completed",
    type: "medical"
  },
  {
    id: "INV-007",
    date: "Jan 30, 2025",
    service: "Chemical Peel",
    provider: "Aesthetic Center",
    amount: 125.00,
    status: "completed",
    type: "aesthetic"
  },
];

const PurchaseHistoryContent = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Filter purchases based on the active tab
  const filteredPurchases = activeTab === "all" 
    ? purchaseData 
    : purchaseData.filter(purchase => purchase.type === activeTab);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="aesthetic">Aesthetic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <PurchaseHistoryTable purchases={filteredPurchases} />
        </TabsContent>
        
        <TabsContent value="medical" className="mt-6">
          <PurchaseHistoryTable purchases={filteredPurchases} />
        </TabsContent>
        
        <TabsContent value="wellness" className="mt-6">
          <PurchaseHistoryTable purchases={filteredPurchases} />
        </TabsContent>
        
        <TabsContent value="aesthetic" className="mt-6">
          <PurchaseHistoryTable purchases={filteredPurchases} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Need Help?
          </CardTitle>
          <CardDescription>
            Have questions about a charge or need assistance with refunds?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Request Receipt
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Billing Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

interface PurchaseHistoryTableProps {
  purchases: {
    id: string;
    date: string;
    service: string;
    provider: string;
    amount: number;
    status: string;
    type: string;
  }[];
}

const PurchaseHistoryTable: React.FC<PurchaseHistoryTableProps> = ({ purchases }) => {
  if (purchases.length === 0) {
    return (
      <div className="text-center p-12 bg-muted/20 rounded-lg">
        <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No purchases found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You don't have any purchases in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">{purchase.id}</TableCell>
              <TableCell>{purchase.date}</TableCell>
              <TableCell>{purchase.service}</TableCell>
              <TableCell>{purchase.provider}</TableCell>
              <TableCell className="text-right">
                {purchase.amount === 0 
                  ? <span className="text-green-600">Covered by membership</span> 
                  : `$${purchase.amount.toFixed(2)}`
                }
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {purchase.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseHistoryContent;
