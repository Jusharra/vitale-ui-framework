import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Briefcase,
  Zap,
  Users,
  ShieldCheck,
  Clock,
  Star,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF = 'tel:+18884002273';

const MARKETS = [
  { state: 'Arizona', cities: ['Phoenix', 'Scottsdale'] },
  { state: 'Texas', cities: ['Dallas', 'Fort Worth'] },
  { state: 'Florida', cities: ['Tampa', 'Naples', 'Boca Raton', 'Jacksonville'] },
  { state: 'Tennessee', cities: ['Nashville'] },
  { state: 'North Carolina', cities: ['Charlotte'] },
];

const VALUES = [
  {
    icon: Clock,
    title: 'Speed as a Standard',
    body: 'Patients in our markets shouldn\'t wait weeks for a non-emergency clinical visit. We coordinate access fast — often same day.',
  },
  {
    icon: ShieldCheck,
    title: 'Licensed and Verified',
    body: 'Every independent professional in our network holds a current license in their state of practice. We verify before we coordinate.',
  },
  {
    icon: Star,
    title: 'White-Glove Coordination',
    body: 'From your first call to provider arrival, the experience should feel effortless. We handle the logistics so you don\'t have to.',
  },
  {
    icon: MapPin,
    title: 'Care Comes to You',
    body: 'Your home, hotel room, office, or place of recovery — the provider comes to your location. You don\'t go anywhere.',
  },
];

const PERSONAS = [
  {
    icon: Briefcase,
    label: 'Executive Traveler',
    description: 'In town for business. Need a physician at the hotel tonight. Can\'t spend tomorrow in urgent care.',
  },
  {
    icon: Zap,
    label: 'Busy Professional',
    description: 'Not sick enough for the ER. Too busy for a three-hour urgent care wait. Need a diagnosis and treatment today.',
  },
  {
    icon: Users,
    label: 'Family Caregiver',
    description: 'Arranging care for a parent who lives across the country. Need a provider at their door — this week, not next month.',
  },
  {
    icon: MapPin,
    label: 'Seasonal Resident',
    description: 'Second home in Scottsdale or Naples. No established local physician. Need access to care during the season.',
  },
];

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Vitalé Health Concierge',
  description:
    'A healthcare coordination and access platform that connects patients with independent licensed healthcare professionals across Arizona, Texas, Florida, Tennessee, and North Carolina.',
  url: 'https://vitalehealthconcierge.doctor',
  telephone: '+18884002273',
  areaServed: ['Arizona', 'Texas', 'Florida', 'Tennessee', 'North Carolina'],
};

const About: React.FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>About Vitalé Health Concierge — Healthcare Coordination Platform</title>
        <meta
          name="description"
          content="Vitalé Health Concierge is a healthcare coordination and access platform that connects patients with independent licensed healthcare professionals. Learn about our model, our markets, and who we serve."
        />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/about" />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>

      {/* ── BREADCRUMB ── */}
      <nav className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">About</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Healthcare Coordination &amp; Access Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
            About Vitalé Health Concierge
          </h1>
          <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
            We are not a clinic. We do not employ physicians. Vitalé is a healthcare coordination and access platform — we connect patients with independent licensed healthcare professionals who deliver care at their location, on their schedule.
          </p>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair">What We Do</h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Vitalé Health Concierge coordinates access to independent licensed healthcare professionals for individuals and families who need care outside of the traditional clinic or hospital setting. When a patient calls us, we identify the right provider from our network, connect them to the request, and confirm the logistics — so the patient gets care at their home, hotel, office, or any other location that works for them.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed">
            Think of us as the coordination layer between patients and the growing ecosystem of independent licensed providers who deliver mobile and in-home clinical services. We handle the access problem. The provider handles the clinical care.
          </p>
          <div className="flex items-start gap-2 text-sm text-amber-600/80 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl px-5 py-4">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Vitalé coordinates non-emergency healthcare access only. For life-threatening emergencies, call 911 or go to your nearest emergency department immediately.</span>
          </div>
        </div>
      </section>

      {/* ── WHY WE EXIST ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair">Why We Exist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-base">The access problem is real.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                In most US markets, a non-emergency clinical visit requires a weeks-long wait for an appointment, a half-day in an urgent care, or an expensive ER visit. For patients who are traveling, managing a parent's care remotely, or simply can't afford to lose a full day — the system doesn't work.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-base">The supply of independent providers is growing.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A growing number of independent physicians, nurse practitioners, and registered nurses offer mobile and in-home clinical services outside of institutional settings. The problem isn't supply — it's that patients don't know how to find and access these providers quickly when they need them.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-base">Vitalé is the coordination layer.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We bridge the gap. Patients call us. We navigate our network. The right provider is connected to the right patient — same day when available. No referral cycles, no authorization delays, no waiting rooms.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-base">The network is the asset.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our value is not a list of providers. Our value is the ability to coordinate access quickly, reliably, and professionally in each market we serve. Patients don't need to find a provider — they need to reach Vitalé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR MARKETS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Our Markets</h2>
          <p className="text-muted-foreground mb-10">
            Vitalé currently coordinates healthcare access in five states across the Sun Belt and Southeast.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {MARKETS.map(({ state, cities }) => (
              <div key={state} className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{state}</p>
                <ul className="space-y-1">
                  {cities.map(city => (
                    <li key={city} className="text-sm text-muted-foreground">{city}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Provider availability varies by market. Call us to confirm current coverage in your area.
          </p>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">How We Operate</h2>
          <p className="text-muted-foreground mb-10">
            Four principles guide every coordination we make.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, body }) => (
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

      {/* ── WHO WE SERVE ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Who We Serve</h2>
          <p className="text-muted-foreground mb-10">
            Most Vitalé patients fall into one of four situations. All of them share a common need: clinical access, fast, without the traditional system's friction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERSONAS.map(({ icon: Icon, label, description }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair">
            Ready to Coordinate Care?
          </h2>
          <p className="text-white/70 text-lg">
            Call us and a real coordinator will answer — 24/7, no hold queues. Describe your situation and we'll tell you exactly what we can do and how fast.
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl md:text-3xl px-10 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_6px_30px_hsl(var(--brand-gold)/0.5)]"
          >
            <Phone className="h-7 w-7" /> {PHONE_NUMBER}
          </a>
          <p className="text-white/40 text-sm">
            Available 24/7 · Real coordinator answers · No hold queues
          </p>
          <p className="text-sm text-white/40 pt-2">
            <Link to="/services" className="hover:text-white/70 underline">View all services</Link>
            {' '}&nbsp;·&nbsp;{' '}
            <Link to="/contact" className="hover:text-white/70 underline">Contact us</Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
