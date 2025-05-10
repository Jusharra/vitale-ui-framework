
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminDashboardHeader: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>("all");

  const handleFeatureChange = (value: string) => {
    setSelectedFeature(value);
    // This state change could be used by parent components via context or props in the future
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>
      <div className="flex items-center space-x-2">
        <Select value={selectedFeature} onValueChange={handleFeatureChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by feature" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Features</SelectLabel>
              <SelectItem value="all">All Features</SelectItem>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="professionals">Professionals</SelectItem>
              <SelectItem value="subscriptions">Subscriptions</SelectItem>
              <SelectItem value="leads">Leads & Conversions</SelectItem>
              <SelectItem value="partners">Partners</SelectItem>
              <SelectItem value="promotions">Promotions</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>
          <span>Generate Reports</span>
        </Button>
        <Button variant="outline">
          <span>System Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
