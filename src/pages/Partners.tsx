import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Phone,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  UserCheck,
  FlaskConical,
  Car,
  Star,
  DollarSign,
  ShieldCheck,
  Users,
} from 'lucide-react';

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF = 'tel:+18884002273';

const PROVIDER_TYPES = [
  { icon: Stethoscope, label: 'Physician (MD / DO)', description: 'Board-certified physicians available for independent mobile and in-home visits.' },
  { icon: UserCheck, label: 'Nurse Practitioner (NP)', description: 'Advanced practice NPs who can independently evaluate, diagnose, and prescribe.' },
  { icon: UserCheck, label: 'Registered Nurse (RN)', description: 'Licensed RNs for IV therapy, wound care, post-surgical monitoring, and skilled home visits.' },
  { icon: FlaskConical, label: 'Mobile Phlebotomist', description: 'Certified phlebotomists who perform blood draws and specimen collection at patient locations.' },
  { icon: Car, label: 'Medical Transport Operator', description: 'Licensed non-emergency medical transport operators with appropriate vehicles and trained personnel.' },
  { icon: Star, label: 'Specialty Provider', description: 'Physical therapists, occupational therapists, and other licensed specialists offering in-home services.' },
];

const WHY_JOIN = [
  {
    icon: DollarSign,
    title: 'Cash-Pay Patients — No Billing Headaches',
    body: 'Every patient Vitalé coordinates is private-pay. You receive payment directly — no insurance claims, no prior authorizations, no chasing reimbursements.',
  },
  {
    icon: Users,
    title: 'Pre-Screened, High-Intent Requests',
    body: 'We qualify patients before connecting them to you. You receive requests from people who are ready to schedule, know the cost, and have already agreed to private-pay terms.',
  },
  {
    icon: ShieldCheck,
    title: 'You Stay Independent',
    body: 'You set your own clinical fees, your own schedule, and your own service area. Vitalé coordinates the access — you retain full clinical and business independence.',
  },
  {
    icon: Star,
    title: 'Consistent Volume Without Marketing Overhead',
    body: 'Instead of spending time on marketing, SEO, or social media, you focus on patient care. We generate and coordinate the demand.',
  },
];

const FAQS = [
  {
    q: 'Do I give up my independence by joining Vitalé\'s network?',
    a: 'No. You remain an independent licensed professional. You set your own rates, accept only the requests you choose, and operate under your own license and liability. Vitalé coordinates the connection between you and the patient — nothing more.',
  },
  {
    q: 'How does Vitalé make money if I set my own fees?',
    a: 'Vitalé charges a coordination fee to the patient separately from your clinical visit fee. Patients are aware of and agree to both fees before any visit is confirmed. Your rate is your rate — we do not take a cut of your clinical charges.',
  },
  {
    q: 'What markets do you currently coordinate in?',
    a: 'We currently coordinate in Phoenix, Scottsdale, Dallas, Fort Worth, Tampa, Naples, Boca Raton, Jacksonville, Nashville, and Charlotte. We are expanding. If you\'re in a market we\'re not yet active in, submit your application and we\'ll notify you when coordination begins in your area.',
  },
  {
    q: 'What licensing and credentials are required?',
    a: 'All providers must hold a current, unrestricted license in their state of practice, carry appropriate professional liability insurance, and pass a credential verification review before being onboarded into the network.',
  },
  {
    q: 'How quickly after applying can I start receiving coordination requests?',
    a: 'After submitting your application, our team reviews credentials and conducts a brief onboarding call. Most providers are onboarded within 5–7 business days of completing verification.',
  },
  {
    q: 'Can I limit the types of requests I receive?',
    a: 'Yes. During onboarding, you specify the service types you offer, your geographic radius, your availability windows, and any patient populations you do not serve. We coordinate only within those parameters.',
  },
];

const PROVIDER_TYPE_OPTIONS = [
  'Physician (MD / DO)',
  'Nurse Practitioner (NP)',
  'Registered Nurse (RN)',
  'Mobile Phlebotomist',
  'Medical Transport Operator',
  'Physical Therapist',
  'Occupational Therapist',
  'Other',
];

const Partners: React.FC = () => {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    providerType: '',
    licenseState: '',
    phone: '',
    email: '',
    serviceArea: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('partner_leads').insert([{
        application_type: 'provider_application',
        status: 'submitted',
        metadata: {
          ...formData,
          submission_date: new Date().toISOString(),
        },
      }]);
      if (error) throw error;
      setIsSubmitted(true);
      toast({ title: 'Application Received', description: 'We\'ll review your credentials and follow up within 1–2 business days.' });
    } catch {
      toast({ title: 'Submission Failed', description: 'Please try again or call us directly.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Join Our Provider Network | Vitalé Health Concierge</title>
        <meta
          name="description"
          content="Independent licensed physicians, NPs, RNs, mobile phlebotomists, and transport operators — join Vitalé's coordinated provider network. Cash-pay patients, no billing headaches, full independence."
        />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/partners" />
      </Helmet>

      {/* ── BREADCRUMB ── */}
      <nav className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">For Providers</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Independent Providers · Licensed Professionals · Our Network
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
            Join the Vitalé Provider Network
          </h1>
          <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
            Vitalé connects independent licensed healthcare professionals with pre-screened, cash-pay patients who need care at their location. You keep your independence. We coordinate the access.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_24px_hsl(var(--brand-gold)/0.5)]"
            >
              Apply to Join
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-3 border border-white/30 text-white font-semibold text-base px-6 py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              <Phone className="h-5 w-5" /> {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* ── WHO WE'RE LOOKING FOR ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Who We Work With</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            We coordinate patients with independently licensed professionals across six provider categories. All providers must hold a current, unrestricted state license and carry appropriate liability coverage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROVIDER_TYPES.map(({ icon: Icon, label, description }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-base">{label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY JOIN ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Why Join Vitalé</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Four reasons independent providers choose to receive coordinated referrals through our platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_JOIN.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 flex gap-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section id="apply" className="py-16 px-4 sm:px-6 lg:px-8 bg-background scroll-mt-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Apply to Join the Network</h2>
          <p className="text-muted-foreground mb-10">
            Submit your information below. We'll review your credentials and follow up within 1–2 business days to schedule a brief onboarding call.
          </p>

          {isSubmitted ? (
            <div className="rounded-2xl border border-border bg-card px-8 py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl">Application Received</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                Thank you for your interest in joining the Vitalé provider network. Our team will review your credentials and reach out within 1–2 business days.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Dr. Jane Smith" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="providerType">Provider Type</Label>
                  <select
                    id="providerType"
                    name="providerType"
                    value={formData.providerType}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select type…</option>
                    {PROVIDER_TYPE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="licenseState">License State(s)</Label>
                  <Input id="licenseState" name="licenseState" value={formData.licenseState} onChange={handleChange} required placeholder="AZ, TX, FL…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="serviceArea">Primary Service Area</Label>
                  <Input id="serviceArea" name="serviceArea" value={formData.serviceArea} onChange={handleChange} required placeholder="Phoenix, AZ" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="(555) 000-0000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Anything else we should know? (optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Services you offer, availability, geographic coverage, questions…"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-lg py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting…' : 'Submit Application'}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                We review all applications manually. You will not be added to any list without a conversation first.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Provider FAQs</h2>
          <p className="text-muted-foreground mb-10">Common questions from providers considering the network.</p>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, idx) => (
              <Collapsible
                key={q}
                open={openFaq === idx}
                onOpenChange={open => setOpenFaq(open ? idx : null)}
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-card border border-border rounded-xl text-left hover:border-primary/40 transition-colors">
                  <span className="font-semibold text-sm md:text-base">{q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 py-4 text-muted-foreground text-sm leading-relaxed border border-t-0 border-border rounded-b-xl bg-card">
                  {a}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair">
            Questions Before Applying?
          </h2>
          <p className="text-white/70 text-lg">
            Call us directly. We'll give you a straightforward answer about whether the network is a good fit for your practice and service area.
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl md:text-3xl px-10 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_6px_30px_hsl(var(--brand-gold)/0.5)]"
          >
            <Phone className="h-7 w-7" /> {PHONE_NUMBER}
          </a>
          <p className="text-white/40 text-sm">
            Available 24/7 · Or{' '}
            <a href="#apply" className="underline hover:text-white/70">submit your application above</a>
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Partners;
