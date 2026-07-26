import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Phone,
  CheckCircle,
  ChevronDown,
  ArrowDown,
  Clock,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Search,
  PhoneIncoming,
  Navigation,
  CalendarCheck,
  CreditCard,
  Star,
  Stethoscope,
  UserCheck,
  Heart,
  Truck,
  Briefcase,
  Users,
  MapPin,
} from 'lucide-react';
import { useQuickIntakeForm } from '@/hooks/useQuickIntakeForm';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CityConfig {
  city: string;
  state: string;
  stateFullName: string;
  slug: string;
  phone: string;
  phoneHref: string;
  h1?: string;
  heroSub: string;
  dispatchTime?: string;
  primaryService: string;
  services: string[];
  serviceLinks?: { label: string; href: string }[];
  neighborhoods: string[];
  faqs: { q: string; a: string }[];
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const CityLandingPage: React.FC<CityConfig> = (cfg) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { formData, updateField, submitForm, isSubmitting } = useQuickIntakeForm();

  // JSON-LD schemas
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Vitalé Health Concierge',
    description: cfg.metaDescription,
    url: cfg.canonicalUrl,
    telephone: cfg.phoneHref.replace('tel:', ''),
    areaServed: `${cfg.city}, ${cfg.stateFullName}`,
    availableLanguage: 'English',
    medicalSpecialty: ['Nursing', 'GeneralPractice', 'HomeHealthCare'],
    openingHours: 'Mo-Su 00:00-24:00',
    address: {
      '@type': 'PostalAddress',
      addressLocality: cfg.city,
      addressRegion: cfg.state,
      addressCountry: 'US',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{cfg.metaTitle}</title>
        <meta name="description" content={cfg.metaDescription} />
        <meta name="keywords" content={cfg.keywords} />
        <link rel="canonical" href={cfg.canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-22">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left */}
            <div className="space-y-6">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest">
                Healthcare Coordination &amp; Access Platform — {cfg.city}, {cfg.state}
              </p>

              <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
                {cfg.h1 ?? `Need a Private Doctor or Nurse in ${cfg.city}?`}
              </h1>

              <p className="text-lg text-white/75 max-w-lg">
                {cfg.heroSub}
              </p>

              {/* Prominent phone */}
              <div>
                <a
                  href={cfg.phoneHref}
                  className="inline-flex items-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_24px_hsl(var(--brand-gold)/0.5)]"
                >
                  <Phone className="h-6 w-6" />
                  {cfg.phone}
                </a>
                <p className="text-white/40 text-xs mt-2 ml-1">
                  Available 24/7 &nbsp;·&nbsp; Real coordinator answers &nbsp;·&nbsp; No hold queues
                </p>
              </div>

              {/* Quick trust */}
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { icon: Clock,       text: '24/7 Dispatch' },
                  { icon: ShieldCheck, text: 'Licensed & Insured' },
                  { icon: Zap,         text: 'Same-Day Available' },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-sm text-white/60">
                    <Icon className="h-4 w-4 text-primary" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — callback form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 shadow-2xl">
              <h2 className="text-lg font-semibold mb-1">Get Connected Today</h2>
              <p className="text-white/50 text-sm mb-5">
                Leave your details and a coordinator calls you back, usually within 15 minutes.
              </p>
              <form
                className="space-y-3"
                onSubmit={async e => { e.preventDefault(); await submitForm(); }}
              >
                <Input
                  value={formData.fullName}
                  onChange={e => updateField('fullName', e.target.value)}
                  placeholder="Your name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  disabled={isSubmitting}
                />
                <Input
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="Phone number"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  disabled={isSubmitting}
                />
                <select
                  value={formData.serviceNeeded}
                  onChange={e => updateField('serviceNeeded', e.target.value)}
                  className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2.5 text-sm focus:outline-none"
                  disabled={isSubmitting}
                >
                  <option value="" className="bg-[#111827]">Service needed…</option>
                  {cfg.services.map(s => (
                    <option key={s} value={s.toLowerCase().replace(/ /g, '-')} className="bg-[#111827]">{s}</option>
                  ))}
                </select>
                <select
                  value={formData.urgency}
                  onChange={e => updateField('urgency', e.target.value)}
                  className="w-full rounded-md bg-white/10 border border-white/20 text-white p-2.5 text-sm focus:outline-none"
                  disabled={isSubmitting}
                >
                  <option value="" className="bg-[#111827]">How soon do you need this?</option>
                  <option value="urgent" className="bg-[#111827]">Today or tomorrow (urgent)</option>
                  <option value="soon" className="bg-[#111827]">This week</option>
                  <option value="planning" className="bg-[#111827]">Planning ahead</option>
                </select>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Request a Callback'}
                </Button>
              </form>

              {/* Emergency disclaimer */}
              <div className="mt-4 flex items-start gap-2 text-xs text-amber-400/80">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>For medical emergencies, call 911 or go to your nearest ER. We coordinate non-emergency visits only.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {cfg.dispatchTime && (
              <span className="flex items-center gap-2 font-semibold text-primary">
                <Zap className="h-4 w-4 shrink-0" />
                Average Dispatch Today: {cfg.dispatchTime}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              Available 24/7
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              Licensed &amp; Verified Providers
            </span>
            <span className="hidden md:flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              Serving{' '}
              {cfg.neighborhoods.slice(0, 4).join(' · ')}
              {cfg.neighborhoods.length > 4 && ' & more'}
            </span>
          </div>
        </div>
      </section>

      {/* ── 5 PROMISES ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-b border-border" id="promises">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">What We Promise Every Patient</h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            These are not marketing claims. They are operational commitments we stand behind on every coordinated visit in {cfg.city}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                promise: '60-Minute Dispatch SLA',
                detail: 'On-site medical care within 60 minutes of booking, or we guarantee a confirmed direct dispatch time slot — no vague "someone will call you."',
              },
              {
                icon: MapPin,
                promise: 'Total Location Flexibility',
                detail: `We come to you — residence, resort room, corporate office, hotel, or private event anywhere in the ${cfg.city} area. Your location is never a barrier.`,
              },
              {
                icon: CheckCircle,
                promise: 'Complete Care Coordination',
                detail: 'One call does it all: on-site evaluation, immediate lab coordination, IV or medication administration, and prescription delivery to your door. You manage nothing.',
              },
              {
                icon: CreditCard,
                promise: 'Flat-Rate Transparent Pricing',
                detail: 'Zero surprise bills. Zero facility fees. Zero complex insurance claims. You know every number before the provider arrives — and nothing changes after.',
              },
              {
                icon: ShieldCheck,
                promise: 'White-Glove Professionalism',
                detail: 'Board-certified MDs, NPs, and PAs delivering unhurried, 1-on-1 private care. Every provider is vetted, credentialed, and briefed on your situation before they arrive.',
              },
            ].map(({ icon: Icon, promise, detail }) => (
              <div key={promise} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-base leading-snug">{promise}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
              </div>
            ))}

            {/* Sixth cell — CTA */}
            <div className="rounded-2xl bg-[hsl(var(--brand-ink))] text-white p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Ready Now</p>
                <h3 className="font-bold text-lg font-playfair leading-snug">
                  Don't wait.<br />Same-day dispatch is available.
                </h3>
              </div>
              <a
                href={cfg.phoneHref}
                className="flex items-center justify-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold px-5 py-3 rounded-xl hover:brightness-110 transition-all text-sm"
              >
                <Phone className="h-4 w-4" /> Call {cfg.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background" id="services">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">
            Services We Coordinate in {cfg.city}
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            We connect {cfg.city} residents with independent licensed healthcare professionals for these services.
            Availability varies — call to confirm.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cfg.services.map(s => (
              <div
                key={s}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span className="font-medium">{s}</span>
              </div>
            ))}
          </div>

          {cfg.serviceLinks && cfg.serviceLinks.length > 0 && (
            <div className="mt-10 p-5 rounded-xl border border-primary/20 bg-primary/5">
              <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Dedicated Service Pages</p>
              <div className="flex flex-wrap gap-3">
                {cfg.serviceLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    to={href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {label}
                    <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <p className="mt-8 text-sm text-muted-foreground">
            Don't see what you need?{' '}
            <a href={cfg.phoneHref} className="text-primary font-semibold hover:underline">
              Call {cfg.phone}
            </a>{' '}
            — our coordinators can often find a match for unlisted services.
          </p>
        </div>
      </section>

      {/* ── PROVIDER CTA ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--brand-ink))]">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-lg font-light shrink-0">i</div>
              <h2 className="text-xl font-semibold text-white">Need a provider today?</h2>
            </div>

            <p className="text-white/65 text-sm leading-relaxed">
              We coordinate access to independent licensed healthcare professionals in {cfg.city},
              including physicians, nurse practitioners, registered nurses, and mobile healthcare services.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Stethoscope, label: 'Physicians' },
                { icon: UserCheck,   label: 'Nurse Practitioners' },
                { icon: Heart,       label: 'Registered Nurses' },
                { icon: Truck,       label: 'Mobile Services' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-white/80 leading-tight">{label}</span>
                </div>
              ))}
            </div>

            <a
              href={cfg.phoneHref}
              className="flex items-center justify-center gap-3 w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:brightness-110 transition-all"
            >
              <Phone className="h-5 w-5" />
              Call Now for Same-Day Coordination
            </a>

            <p className="text-xs text-white/35 text-center">
              This is not emergency medical care. If you are experiencing a medical emergency, call 911.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border" id="how-it-works">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3 text-center">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12">
            Six steps from search to care — and a feedback loop that keeps quality high.
          </p>

          <div className="space-y-2">
            {[
              {
                icon: Search,
                label: 'Step 1 — Discovery',
                title: 'You Find Us',
                body: `You searched for private healthcare in ${cfg.city} — that's the first step. We invest in local SEO so high-intent patients in the ${cfg.city} area can reach us the moment they need care.`,
              },
              {
                icon: PhoneIncoming,
                label: 'Step 2 — Intake',
                title: 'Call or Submit a Request',
                body: 'A real coordinator answers — no hold queues, no bots. You tell us what you need, where you are, and how soon. We capture the full picture before we dispatch anyone.',
              },
              {
                icon: Navigation,
                label: 'Step 3 — Dispatch',
                title: 'We Route to the Best Available Provider',
                body: `We match your request to the nearest available independent licensed provider in the ${cfg.city} area who fits your specific need — physician, RN, NP, or specialist.`,
              },
              {
                icon: CalendarCheck,
                label: 'Step 4 — Confirmation',
                title: 'Details Confirmed with You & the Provider',
                body: 'The provider confirms the visit window directly with you. We stay in the loop to make sure timing, location, and clinical scope are aligned on both sides before anyone travels.',
              },
              {
                icon: CreditCard,
                label: 'Step 5 — Payment',
                title: 'Coordination Fee Collected Separately',
                body: "Vitalé charges a transparent coordination fee. The provider's clinical charges are separate and disclosed upfront. No surprises — you know every number before the visit begins.",
              },
              {
                icon: Star,
                label: 'Step 6 — Review',
                title: 'Your Feedback Improves the Network',
                body: 'After your visit, we collect feedback. Provider rankings in our network are informed by real patient experiences — so the best providers rise and the bar keeps moving up.',
              },
            ].map((step, idx, arr) => (
              <React.Fragment key={step.label}>
                <div className="bg-card border border-border rounded-xl px-7 py-6 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-0.5">{step.label}</p>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-5 w-5 text-primary/40" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={cfg.phoneHref}
              className="inline-flex items-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_20px_hsl(var(--brand-gold)/0.4)]"
            >
              <Phone className="h-5 w-5" /> Call {cfg.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">
            Who We Serve in {cfg.city}
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Vitalé is built for people whose situation doesn't fit the standard clinic model — and who value their time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Briefcase,
                label: 'Executive Traveler',
                headline: 'In town for business. Need care today.',
                body: `You're in ${cfg.city} for work, your schedule is packed, and getting sick is not a delay you can afford. One call dispatches a licensed provider to your hotel room — so you lose an hour, not a day.`,
              },
              {
                icon: Zap,
                label: 'Busy Professional',
                headline: "Can't spend three hours in urgent care.",
                body: `Your time has a cost. We send a qualified provider to your home, office, or wherever you are in ${cfg.city} — no waiting rooms, no wasted commute, no managing logistics yourself.`,
              },
              {
                icon: Users,
                label: 'Family Caregiver',
                headline: 'Need to arrange care for a parent.',
                body: `You may be across the country. You may not know the providers in ${cfg.city}. Call us once — we coordinate the right licensed professional, confirm the visit, and keep you updated throughout.`,
              },
              {
                icon: MapPin,
                label: 'Seasonal Resident',
                headline: 'Second home. No established local physician.',
                body: `You're in ${cfg.city} for the season and need reliable access to care without starting from scratch. We connect you with independent providers who come to you — no referral required.`,
              },
            ].map(({ icon: Icon, label, headline, body }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">{label}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug">{headline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[hsl(var(--brand-ink))] text-white rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <p className="text-sm text-white/50 uppercase tracking-widest font-semibold">The bottom line</p>
              <p className="text-xl font-semibold font-playfair leading-snug max-w-md">
                You don't need to know which provider to call.<br />
                You just need to call us.
              </p>
              <p className="text-white/60 text-sm">
                Every provider in our network is licensed, insured, and verified before we dispatch them.
              </p>
            </div>
            <a
              href={cfg.phoneHref}
              className="inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold px-7 py-4 rounded-xl hover:brightness-110 transition-all text-sm shrink-0 whitespace-nowrap"
            >
              <Phone className="h-4 w-4" /> {cfg.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── AREAS WE SERVE ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border" id="areas">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">Areas We Serve</h2>
          <p className="text-muted-foreground mb-8">
            We coordinate services throughout the {cfg.city} metro area, including:
          </p>

          <div className="flex flex-wrap gap-2">
            {cfg.neighborhoods.map(n => (
              <span
                key={n}
                className="text-sm px-4 py-2 rounded-full border border-border bg-card font-medium hover:border-primary hover:text-primary transition-colors cursor-default"
              >
                {n}
              </span>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Don't see your neighborhood?{' '}
            <a href={cfg.phoneHref} className="text-primary font-semibold hover:underline">
              Call us
            </a>{' '}
            — coverage is expanding and a coordinator can confirm your address.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-10">
            Common questions about private healthcare coordination in {cfg.city}.
          </p>

          <div className="space-y-3">
            {cfg.faqs.map(({ q, a }, idx) => (
              <Collapsible
                key={q}
                open={openFaq === idx}
                onOpenChange={open => setOpenFaq(open ? idx : null)}
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-card border border-border rounded-xl text-left hover:border-primary/40 transition-colors">
                  <span className="font-semibold text-sm md:text-base">{q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
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
            Need Healthcare in {cfg.city} Today?
          </h2>
          <p className="text-white/70 text-lg">
            Call now and we'll coordinate with an available independent licensed provider in the {cfg.city} area.
          </p>

          <a
            href={cfg.phoneHref}
            className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl md:text-3xl px-10 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_6px_30px_hsl(var(--brand-gold)/0.5)]"
          >
            <Phone className="h-7 w-7" />
            {cfg.phone}
          </a>

          <p className="text-white/40 text-sm">
            Available 24/7 &nbsp;·&nbsp; Real coordinator answers &nbsp;·&nbsp; No hold queues
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-amber-400/70 mt-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>For medical emergencies, call 911 or go to your nearest emergency department.</span>
          </div>

          <p className="text-sm text-white/40 pt-4">
            <Link to="/" className="hover:text-white/70 underline">Back to main site</Link>
          </p>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[hsl(var(--brand-gold))] px-4 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
        <div>
          <p className="text-[hsl(var(--brand-ink))] text-xs font-semibold">Same-Day Dispatch Available</p>
          <p className="text-[hsl(var(--brand-ink))] text-sm font-bold">{cfg.city}, {cfg.state}</p>
        </div>
        <a
          href={cfg.phoneHref}
          className="bg-[hsl(var(--brand-ink))] text-white font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shrink-0"
        >
          <Phone className="h-4 w-4" /> Call Now
        </a>
      </div>
    </MainLayout>
  );
};

export default CityLandingPage;
