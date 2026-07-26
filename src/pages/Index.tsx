import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Helmet } from 'react-helmet';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import {
  Phone,
  MapPin,
  CheckCircle,
  ChevronDown,
  ArrowDown,
  Clock,
  ShieldCheck,
  Zap,
  Users,
  Stethoscope,
  UserCheck,
  Heart,
  Truck,
  Briefcase,
} from 'lucide-react';
import { useQuickIntakeForm } from '@/hooks/useQuickIntakeForm';

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF  = 'tel:+18884002273';

const SERVICES = [
  'Concierge Physicians',
  'Mobile Doctors',
  'Nurse Practitioners',
  'Registered Nurses',
  'Mobile Lab Services',
  'Post-Surgical Care',
  'Wellness Visits',
  'Hotel Visits',
  'Home Visits',
  'IV Therapy',
  'Hospice Coordination',
  'Assisted Living Placement',
];

const PERSONAS = [
  {
    icon: Briefcase,
    label: 'Executive Traveler',
    headline: 'In town for business. Need care today.',
    body: "You're staying at a hotel, your schedule is packed, and getting sick is not a delay you can afford. One call dispatches a licensed provider to your room — so you lose an hour, not a day.",
  },
  {
    icon: Zap,
    label: 'Busy Professional',
    headline: "Can't spend three hours in urgent care.",
    body: 'Your time has a cost. We send a qualified provider to your home, office, or wherever you are — so your day stays as intact as possible. No waiting rooms, no forms, no wasted commute.',
  },
  {
    icon: Users,
    label: 'Family Caregiver',
    headline: 'Need to arrange care for a parent.',
    body: "You may be across the country. You may not know the local providers. Call us once — we coordinate the right licensed professional, confirm the visit, and keep you in the loop.",
  },
  {
    icon: MapPin,
    label: 'Seasonal Resident',
    headline: 'Second home. No established local physician.',
    body: "You're here for the season and need reliable access to care without starting from scratch. We connect you with independent providers who come to you — no referral required.",
  },
];

const AREAS: { label: string; cities: { name: string; slug?: string }[] }[] = [
  {
    label: 'Arizona',
    cities: [
      { name: 'Scottsdale', slug: 'scottsdale' },
      { name: 'Phoenix', slug: 'phoenix' },
    ],
  },
  {
    label: 'Texas',
    cities: [
      { name: 'Dallas', slug: 'dallas' },
      { name: 'Fort Worth', slug: 'fort-worth' },
    ],
  },
  {
    label: 'Florida',
    cities: [
      { name: 'Tampa' },
      { name: 'Naples' },
      { name: 'Boca Raton' },
      { name: 'Jacksonville' },
    ],
  },
  {
    label: 'Tennessee & North Carolina',
    cities: [
      { name: 'Nashville' },
      { name: 'Charlotte' },
    ],
  },
];

const FAQS = [
  {
    q: "I'm in town for business and staying at a hotel — can you send someone to my room?",
    a: "Yes. Hotel and resort room visits are among our most common requests. One call and we dispatch an available licensed provider directly to your room — physician, RN, or NP depending on what you need. Tell us your hotel and what's going on and we'll handle the rest.",
  },
  {
    q: "I can't spend hours in urgent care — can you really coordinate everything?",
    a: "That's exactly what we exist for. You make one call. We identify the right provider, dispatch them to your location, confirm the details on both sides, and follow up afterward. You don't manage any of it.",
  },
  {
    q: "I'm arranging care for a parent in another city. Can you help?",
    a: "Yes. We regularly coordinate care for patients on behalf of family members calling from out of state. Tell us your parent's location, what they need, and how urgently — we'll coordinate a licensed provider and keep you updated throughout.",
  },
  {
    q: "I have a second home here and no established local physician. How do I get care?",
    a: "You call us. We coordinate with independent licensed physicians and nurses who don't require an existing patient relationship. Whether you've just arrived for the season or need care unexpectedly, we can arrange a visit the same day you call.",
  },
  {
    q: 'Do you provide emergency care?',
    a: 'No. If you have a medical emergency, call 911 or go to the nearest emergency department immediately. We coordinate non-emergency, scheduled, and same-day clinical visits only.',
  },
  {
    q: 'What is the difference between Vitalé and a clinic?',
    a: 'Vitalé Health Concierge is a healthcare coordination and access platform, not a clinic or employer of providers. We connect patients with independent licensed healthcare professionals who deliver care at your home, hotel, or office.',
  },
  {
    q: 'How much does coordination cost?',
    a: "Vitalé charges a coordination fee that is separate from the provider's clinical charges. The provider sets their own rates, which we disclose to you before the visit begins. No surprises.",
  },
  {
    q: 'What areas do you serve?',
    a: 'We currently coordinate services across Arizona, Texas, Florida, Tennessee, and North Carolina — including Scottsdale, Phoenix, Dallas, Fort Worth, Tampa, Naples, Boca Raton, Jacksonville, Nashville, and Charlotte. Call to confirm availability in your specific city.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Vitalé Health Concierge',
  description: 'Vitalé Health Concierge is a healthcare coordination and access platform that connects patients with independent licensed healthcare professionals for home, hotel, and office visits across Arizona, Texas, Florida, Tennessee, and North Carolina.',
  url: 'https://vitalehealthconcierge.doctor',
  telephone: '+18884002273',
  areaServed: ['Arizona', 'Texas', 'Florida', 'Tennessee', 'North Carolina'],
  availableLanguage: 'English',
  medicalSpecialty: ['Nursing', 'GeneralPractice', 'HomeHealthCare'],
  openingHours: 'Mo-Su 00:00-24:00',
};

const Index = () => {
  const [zip, setZip] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  useAuth();
  const { formData, updateField, submitForm, isSubmitting } = useQuickIntakeForm();

  const handleZip = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.trim()) navigate(`/marketplace?zip=${zip.trim()}`);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Healthcare Coordination &amp; Access Platform — Mobile Doctors &amp; Nurses | Vitalé Health Concierge</title>
        <meta name="description" content="Vitalé Health Concierge is a healthcare coordination and access platform that connects patients with independent licensed healthcare professionals for same-day home, hotel, and office visits across AZ, TX, FL, TN &amp; NC." />
        <meta name="keywords" content="concierge doctor near me, mobile doctor home visit, private nurse at home, same day doctor visit, in-home medical care, concierge medicine, healthcare coordination Arizona Texas Florida Tennessee North Carolina" />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/" />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* ──────────────────────────────────────────
          HERO
      ────────────────────────────────────────── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Healthcare Coordination &amp; Access Platform — AZ · TX · FL · TN · NC
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight mb-5">
            Need a Private Doctor or Nurse Today?
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10">
            In town for business. Arranging care for a parent. No local doctor at your second home.
            Whatever the situation — we coordinate an independent licensed provider to your door, same day when available.
          </p>

          {/* Primary CTA — phone */}
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl md:text-3xl px-10 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_6px_30px_hsl(var(--brand-gold)/0.5)] mb-4"
          >
            <Phone className="h-7 w-7" />
            {PHONE_NUMBER}
          </a>

          <p className="text-white/50 text-sm mb-10">
            Available 24/7 &nbsp;·&nbsp; Real coordinator answers &nbsp;·&nbsp; No hold queues
          </p>

          {/* Secondary — zip routing */}
          <form onSubmit={handleZip} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                value={zip}
                onChange={e => setZip(e.target.value)}
                placeholder="Enter your zip code"
                maxLength={5}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6 shrink-0">
              Get Connected Today
            </Button>
          </form>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          TRUST BAR
      ────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock,       text: '24/7 Availability' },
              { icon: ShieldCheck, text: 'Licensed & Insured Providers' },
              { icon: Zap,         text: 'Same-Day Coordination' },
              { icon: Users,       text: 'Independent Physicians & RNs' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          SERVICES
      ────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background" id="services">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">Services We Coordinate</h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            We connect you with independent licensed professionals for a wide range of in-person healthcare services.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {SERVICES.map(s => (
              <div key={s} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="font-medium">{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a href={PHONE_HREF} className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              <Phone className="h-4 w-4" /> Call to discuss your specific need
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          PROVIDER CTA
      ────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--brand-ink))]">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-lg font-light shrink-0">i</div>
              <h2 className="text-xl font-semibold text-white">Need a provider today?</h2>
            </div>

            <p className="text-white/65 text-sm leading-relaxed">
              We coordinate access to independent licensed healthcare professionals in your area,
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
              href={PHONE_HREF}
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

      {/* ──────────────────────────────────────────
          HOW IT WORKS
      ────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border" id="how-it-works">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3 text-center">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12">
            Four steps from your call to care at your door.
          </p>

          <div className="space-y-2">
            {[
              {
                num: '1',
                title: 'Call Us',
                body: 'Tell us what type of healthcare service you\'re looking for — doctor visit, nurse, IV therapy, post-surgical care, or anything else.',
              },
              {
                num: '2',
                title: 'We Coordinate',
                body: 'We identify the nearest available independent licensed provider in your area who can fulfill your request.',
              },
              {
                num: '3',
                title: 'Provider Confirms',
                body: 'The provider contacts you directly to confirm the visit details, timing, and any clinical questions.',
              },
              {
                num: '4',
                title: 'Care Comes to You',
                body: 'Receive care at your home, hotel, office, or any location — depending on the service requested.',
              },
            ].map((step, idx, arr) => (
              <React.Fragment key={step.num}>
                <div className="bg-card border border-border rounded-xl px-7 py-6 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shrink-0">
                    {step.num}
                  </div>
                  <div>
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
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_20px_hsl(var(--brand-gold)/0.4)]"
            >
              <Phone className="h-5 w-5" /> Call {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          WHO WE SERVE
      ────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">Who We Serve</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Vitalé is a healthcare coordination and access platform built for people whose situation doesn't fit
            the standard clinic model — and who value their time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PERSONAS.map(({ icon: Icon, label, headline, body }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5 text-primary" />
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
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold px-7 py-4 rounded-xl hover:brightness-110 transition-all text-sm shrink-0 whitespace-nowrap"
            >
              <Phone className="h-4 w-4" /> {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          AREAS WE SERVE
      ────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border" id="areas">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">Areas We Serve</h2>
          <p className="text-muted-foreground mb-10">
            We coordinate services across Arizona, Texas, Florida, Tennessee, and North Carolina. Don't see your city? Call — coverage is expanding monthly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {AREAS.map(({ label, cities }) => (
              <div key={label}>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-primary mb-3">{label}</h3>
                <ul className="space-y-1.5">
                  {cities.map(({ name, slug }) => (
                    <li key={name}>
                      <Link
                        to={slug ? `/${slug}` : `/marketplace?city=${encodeURIComponent(name)}`}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            <a href={PHONE_HREF} className="text-primary font-semibold hover:underline">Call {PHONE_NUMBER}</a>
            {' '}to confirm same-day availability in your specific location.
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          FAQ
      ────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-10">
            Common questions about our healthcare coordination service.
          </p>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, idx) => (
              <Collapsible
                key={q}
                open={openFaq === idx}
                onOpenChange={open => setOpenFaq(open ? idx : null)}
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-card border border-border rounded-xl text-left hover:border-primary/40 transition-colors group">
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

          <p className="mt-8 text-sm text-muted-foreground">
            Have a question not listed here?{' '}
            <a href={PHONE_HREF} className="text-primary font-semibold hover:underline">Call us 24/7</a>.
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          FINAL CTA
      ────────────────────────────────────────── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair">Need Healthcare Today?</h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Call now and we'll coordinate with an available independent licensed healthcare professional in your area.
          </p>

          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl md:text-3xl px-10 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_6px_30px_hsl(var(--brand-gold)/0.5)]"
          >
            <Phone className="h-7 w-7" />
            {PHONE_NUMBER}
          </a>

          <p className="text-white/40 text-sm">
            Available 24/7 &nbsp;·&nbsp; No hold queues &nbsp;·&nbsp; Real coordinator answers
          </p>

          {/* Prefer form */}
          <details className="max-w-md mx-auto text-left mt-4">
            <summary className="text-sm text-white/50 hover:text-white/80 cursor-pointer transition-colors text-center">
              Prefer a callback instead? →
            </summary>
            <form
              className="mt-5 space-y-3"
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
              <Input
                value={formData.zipCode}
                onChange={e => updateField('zipCode', e.target.value)}
                placeholder="Zip code"
                maxLength={5}
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
                <option value="physician" className="bg-[#111827]">Concierge Physician / Mobile Doctor</option>
                <option value="nurse" className="bg-[#111827]">Registered Nurse</option>
                <option value="iv-therapy" className="bg-[#111827]">IV Therapy</option>
                <option value="post-surgery" className="bg-[#111827]">Post-Surgical Care</option>
                <option value="hospice" className="bg-[#111827]">Hospice Coordination</option>
                <option value="placement" className="bg-[#111827]">Assisted Living Placement</option>
                <option value="other" className="bg-[#111827]">Other</option>
              </select>
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Request a Callback'}
              </Button>
            </form>
          </details>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
