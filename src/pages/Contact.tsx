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
  Mail,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF = 'tel:+18884002273';
const EMAIL = 'vitalehealthconcierge@gmail.com';

const INQUIRY_TYPES = [
  'I need care coordinated today',
  'I have a question about a service',
  'I\'m a provider interested in joining the network',
  'I\'m a member with an account question',
  'Press / media inquiry',
  'Other',
];

const FAQS = [
  {
    q: 'What is the fastest way to get a provider coordinated?',
    a: `Call ${PHONE_NUMBER} directly. A real coordinator answers 24/7. The contact form is for non-urgent inquiries — if you need care today, call.`,
  },
  {
    q: 'How quickly do you respond to contact form submissions?',
    a: 'We respond to form submissions within one business day. For same-day or urgent requests, call us directly — the form is not monitored in real time.',
  },
  {
    q: 'I\'m a provider interested in joining the network. Where do I apply?',
    a: 'Visit our For Providers page to submit a provider application. You can also call us or use the form on this page and select "Provider network inquiry" as your subject.',
  },
];

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
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
        application_type: 'contact_inquiry',
        status: 'submitted',
        metadata: {
          ...formData,
          submission_date: new Date().toISOString(),
        },
      }]);
      if (error) throw error;
      setIsSubmitted(true);
      toast({ title: 'Message Received', description: 'We\'ll follow up within one business day. For urgent care needs, please call us directly.' });
    } catch {
      toast({ title: 'Submission Failed', description: 'Please try again or call us directly.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Contact Vitalé Health Concierge — 24/7 Coordination</title>
        <meta
          name="description"
          content="Contact Vitalé Health Concierge for same-day healthcare coordination. Call (888) 400-2273 — a real coordinator answers 24/7. For non-urgent inquiries, use our contact form."
        />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/contact" />
      </Helmet>

      {/* ── BREADCRUMB ── */}
      <nav className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">Contact</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Available 24/7 · Real Coordinator Answers
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
            Need Care Now? Call Us.
          </h1>
          <p className="text-lg text-white/75 max-w-xl leading-relaxed">
            For same-day coordination, call directly. A real coordinator answers around the clock — no hold queues, no automated systems.
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl px-8 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_24px_hsl(var(--brand-gold)/0.5)]"
          >
            <Phone className="h-7 w-7" /> {PHONE_NUMBER}
          </a>
          <div className="flex items-start gap-2 text-xs text-amber-400/70 pt-1">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>For medical emergencies, call 911 or go to the nearest emergency department.</span>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO + FORM ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Contact details */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-playfair">Contact Details</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Phone</p>
                  <a href={PHONE_HREF} className="text-primary font-bold text-base hover:underline">
                    {PHONE_NUMBER}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">Available 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <a href={`mailto:${EMAIL}`} className="text-primary text-sm font-medium hover:underline break-all">
                    {EMAIL}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">Non-urgent inquiries · 1 business day response</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Coordination Hours</p>
                  <p className="text-sm font-medium">24 hours a day, 7 days a week</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Same-day availability varies by market and provider</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 space-y-1.5">
              <p className="text-sm font-semibold">For Providers</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Independent physicians, NPs, RNs, and other licensed professionals looking to join our network — visit our{' '}
                <Link to="/partners" className="text-primary font-semibold hover:underline">For Providers page</Link>.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold font-playfair mb-6">Send a Message</h2>
            <p className="text-muted-foreground text-sm mb-8">
              For non-urgent inquiries only. We respond within one business day. <strong>If you need care coordinated today, call us.</strong>
            </p>

            {isSubmitted ? (
              <div className="rounded-2xl border border-border bg-card px-8 py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl">Message Received</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                  We'll follow up within one business day. If you need immediate assistance, call{' '}
                  <a href={PHONE_HREF} className="text-primary font-semibold">{PHONE_NUMBER}</a>.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Smith" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(555) 000-0000" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inquiryType">What is this about?</Label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select a topic…</option>
                    {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what you need…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-lg py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  This form is for non-urgent inquiries. For same-day care coordination, call{' '}
                  <a href={PHONE_HREF} className="text-primary font-semibold">{PHONE_NUMBER}</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Common Questions</h2>
          <p className="text-muted-foreground mb-10">Quick answers before you reach out.</p>

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
            Need Care Coordinated Today?
          </h2>
          <p className="text-white/70 text-lg">
            Don't submit a form. Call us. A coordinator answers 24/7 and can often have a provider on the way within the hour.
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl md:text-3xl px-10 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_6px_30px_hsl(var(--brand-gold)/0.5)]"
          >
            <Phone className="h-7 w-7" /> {PHONE_NUMBER}
          </a>
          <p className="text-white/40 text-sm">
            Available 24/7 · No hold queues · Real coordinator answers
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
