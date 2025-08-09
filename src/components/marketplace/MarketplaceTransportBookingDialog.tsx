import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transport {
  id: string;
  name: string;
}

interface Props {
  transport: Transport;
}

const MarketplaceTransportBookingDialog: React.FC<Props> = ({ transport }) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2>(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [priceCents, setPriceCents] = React.useState<number | null>(null);
  const [currency, setCurrency] = React.useState<string>("usd");

  const [date, setDate] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState<string>("");
  const [pickupLocation, setPickupLocation] = React.useState("");
  const [dropoffLocation, setDropoffLocation] = React.useState("");
  const [transportType, setTransportType] = React.useState("standard");
  const [specialRequirements, setSpecialRequirements] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    // Fetch pricing for medical transport
    (async () => {
      const { data, error } = await supabase
        .from("marketplace_pricing")
        .select("amount_cents, currency")
        .eq("service_key", "medical_transport")
        .eq("is_active", true)
        .maybeSingle();
      if (error) {
        console.error("Failed to load pricing", error);
        toast({
          title: "Pricing unavailable",
          description: "Unable to load transport pricing. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      if (data) {
        setPriceCents(data.amount_cents);
        setCurrency(data.currency || "usd");
      }
    })();
  }, [open, toast]);

  const reset = () => {
    setStep(1);
    setDate(undefined);
    setTime("");
    setPickupLocation("");
    setDropoffLocation("");
    setTransportType("standard");
    setSpecialRequirements("");
    setCustomerName("");
    setCustomerPhone("");
  };

  const handleProceed = () => {
    if (!customerName || !customerPhone || !pickupLocation || !dropoffLocation || !date || !time) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    if (priceCents == null) {
      toast({
        title: "Pricing not available",
        description: "Transport pricing is not configured.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePay = async () => {
    try {
      setIsLoading(true);
      const booking_details = {
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        date: date ? date.toISOString().slice(0, 10) : null,
        time,
        transport_type: transportType,
        special_requirements: specialRequirements || undefined,
      };

      const { data, error } = await supabase.functions.invoke("create-marketplace-payment", {
        body: {
          service_key: "medical_transport",
          provider_type: "transport",
          provider_id: transport.id,
          provider_name: transport.name,
          customer_name: customerName,
          customer_phone: customerPhone,
          booking_details,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        setOpen(false);
        reset();
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Transport checkout error:", err);
      toast({
        title: "Checkout failed",
        description: err?.message || "An error occurred during checkout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formattedPrice = priceCents != null ? new Intl.NumberFormat(undefined, { style: "currency", currency: (currency || "USD").toUpperCase() }).format(priceCents / 100) : "—";

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm">Book Transport</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Book Medical Transport</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full name *</Label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>
              </div>

              <div>
                <Label>Pickup location *</Label>
                <Input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Address or facility name" />
              </div>

              <div>
                <Label>Dropoff location *</Label>
                <Input value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} placeholder="Address or facility name" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("justify-start font-normal", !date && "text-muted-foreground")}> 
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toDateString() : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Time *</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Transport type</Label>
                  <Select value={transportType} onValueChange={setTransportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="wheelchair">Wheelchair</SelectItem>
                      <SelectItem value="stretcher">Stretcher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price</Label>
                  <div className="h-10 w-full rounded-md border px-3 py-2 text-sm flex items-center text-foreground/80">
                    {formattedPrice}
                  </div>
                </div>
              </div>

              <div>
                <Label>Special requirements</Label>
                <Textarea value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} placeholder="Anything else we should know?" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleProceed}>Continue</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm & Pay</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Provider</div>
                <div className="font-medium">{transport.name}</div>
                <div className="text-muted-foreground">Date</div>
                <div className="font-medium">{date?.toDateString()} {time}</div>
                <div className="text-muted-foreground">Type</div>
                <div className="font-medium capitalize">{transportType}</div>
                <div className="text-muted-foreground">Pickup</div>
                <div className="font-medium">{pickupLocation}</div>
                <div className="text-muted-foreground">Dropoff</div>
                <div className="font-medium">{dropoffLocation}</div>
              </div>
              <div className="pt-2 flex items-center justify-between border-t mt-3">
                <div className="text-muted-foreground">Total</div>
                <div className="text-lg font-semibold">{formattedPrice}</div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handlePay} disabled={isLoading}>{isLoading ? "Processing..." : "Proceed to Payment"}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceTransportBookingDialog;
