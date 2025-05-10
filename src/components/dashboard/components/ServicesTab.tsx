
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, CircleDollarSign, PiggyBank, ShieldCheck } from "lucide-react";

const ServicesTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
            onClick={() => navigate("/dashboard/medical-transport")}
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
          <span>Browse All Services</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServicesTab;
