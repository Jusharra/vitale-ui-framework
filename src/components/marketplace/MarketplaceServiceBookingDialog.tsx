import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ServiceInfo {
  id: string;
  name: string;
  price?: number;
  duration?: string;
  category?: string;
}

interface Props {
  service: ServiceInfo;
}

const MarketplaceServiceBookingDialog: React.FC<Props> = ({ service }) => {
  const { toast } = useToast();
  const { membershipTier } = useAuth();
  const isPremium = membershipTier === "premium"; // UI hint only; server computes final discount

  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2>(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const [date, setDate] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");

  type ProfessionalLite = {
    id: string;
    name: string;
    profile_image?: string | null;
    verified?: boolean | null;
    rating?: number | null;
  };
  const [professionals, setProfessionals] = React.useState<ProfessionalLite[]>([]);

  React.useEffect(() => {
    if (!open) return;
    const fetchPros = async () => {
      try {
        let query = supabase
          .from('partners')
          .select('id,name,profile_image,verified,rating')
          .eq('status', 'active');
        if (service.category) {
          // filter by specialty/category when available
          // @ts-ignore - contains operator for text[]
          query = query.contains('specialties', [service.category]);
        }
        const { data } = await query
          .order('verified', { ascending: false })
          .order('rating', { ascending: false })
          .limit(3);
        setProfessionals(data || []);
      } catch (e) {
        console.warn('Failed to load professionals for service', e);
      }
    };
    fetchPros();
  }, [open, service.category]);

  const basePriceCents = Number.isFinite(service.price as number)
    ? Math.round((service.price as number) * 100)
    : null;
  const discountedCents = basePriceCents != null ? Math.round(basePriceCents * 0.9) : null;

  const reset = () => {
    setStep(1);
    setDate(undefined);
    setTime("");
    setNotes("");
    setCustomerName("");
    setCustomerPhone("");
  };

  const handleProceed = () => {
    if (!customerName || !customerPhone || !date || !time) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    if (basePriceCents == null) {
      toast({
        title: "Price unavailable",
        description: "This service does not have a configured price.",
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
        date: date ? date.toISOString().slice(0, 10) : null,
        time,
        notes: notes || undefined,
        duration: service.duration || undefined,
      };

      const { data, error } = await supabase.functions.invoke("create-marketplace-payment", {
        body: {
          service_key: "service_booking",
          provider_type: "service",
          provider_id: service.id,
          provider_name: service.name,
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
      console.error("Service checkout error:", err);
      toast({
        title: "Checkout failed",
        description: err?.message || "An error occurred during checkout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (cents: number | null) => {
    if (cents == null) return "—";
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(cents / 100);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Book {service.name}</DialogTitle>
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

              <div>
                <Label>Notes (optional)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else we should know?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <div className="h-10 w-full rounded-md border px-3 py-2 text-sm flex items-center text-foreground/80">
                    {service.duration || "—"}
                  </div>
                </div>
                <div>
                  <Label>Price</Label>
                  <div className="h-10 w-full rounded-md border px-3 py-2 text-sm flex items-center justify-between text-foreground/80">
                    {isPremium && basePriceCents != null ? (
                      <>
                        <span className="line-through opacity-70 mr-2">{formatCurrency(basePriceCents)}</span>
                        <span className="font-medium">{formatCurrency(discountedCents)}</span>
                      </>
                    ) : (
                      <span className="font-medium">{formatCurrency(basePriceCents)}</span>
                    )}
                  </div>
                  {isPremium && (
                    <p className="text-xs text-muted-foreground mt-1">Member discount: 10% off</p>
                  )}
                </div>
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
                <div className="text-muted-foreground">Service</div>
                <div className="font-medium">{service.name}</div>
                <div className="text-muted-foreground">Date</div>
                <div className="font-medium">{date?.toDateString()} {time}</div>
                {service.duration && (
                  <>
                    <div className="text-muted-foreground">Duration</div>
                    <div className="font-medium">{service.duration}</div>
                  </>
                )}
                {/* Professional assignment preview */}
                {professionals.length > 0 ? (
                  <>
                    <div className="text-muted-foreground">Professional</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={professionals[0].profile_image || undefined} alt={professionals[0].name} />
                        <AvatarFallback>{professionals[0].name?.charAt(0) || 'P'}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{professionals[0].name}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-muted-foreground">Professional</div>
                    <div className="font-medium">Assigned after payment</div>
                  </>
                )}
              </div>
              <div className="pt-2 flex items-center justify-between border-t mt-3">
                <div className="text-muted-foreground">Total</div>
                <div className="text-lg font-semibold">
                  {isPremium ? formatCurrency(discountedCents) : formatCurrency(basePriceCents)}
                </div>
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

export default MarketplaceServiceBookingDialog;