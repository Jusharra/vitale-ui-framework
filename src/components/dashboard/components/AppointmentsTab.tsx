
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
import { Calendar, MapPin, Timer, User } from "lucide-react";

interface Appointment {
  id: number;
  type: string;
  provider: string;
  date: string;
  time: string;
  location: string;
}

interface AppointmentsTabProps {
  appointments: Appointment[];
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ appointments }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
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
                  <Button size="sm"><span>Details</span></Button>
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
                <span>Book Appointment</span>
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
            <span>View All Appointments</span>
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
              <span>Contact</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/dashboard/messages")}
          >
            <span>Message Care Team</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentsTab;
