import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Phone,
  Stethoscope,
  UserCheck,
  Heart,
  FlaskConical,
  Car,
  Star,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF = 'tel:+18884002273';

const SERVICES = [
  {
    icon: Stethoscope,
    name: 'Same-Day Healthcare Coordination',
    slug: 'same-day-healthcare-coordination',
    tagline: 'The fastest path to a provider — today.',
    description:
      'Vitalé connects you with an independent licensed provider for same-day visits when you need care now and can\'t — or won\'t — wait in an urgent care.',
    intent: 'same day doctor near me',
  },
  {
    icon: Stethoscope,
    name: 'Mobile Doctor Coordination',
    slug: 'mobile-doctor-coordination',
    tagline: 'A physician at your door. No waiting room.',
    description:
      'We coordinate independent board-certified physicians and nurse practitioners for home, hotel, and office visits across our service markets.',
    intent: 'mobile doctor near me',
  },
  {
    icon: UserCheck,
    name: 'Private Nurse Coordination',
    slug: 'private-nurse-coordination',
    tagline: 'Licensed RNs dispatched to your location.',
    description:
      'IV therapy, wound care, post-surgical monitoring, medication administration — we connect you with independent registered nurses for in-home clinical support.',
    intent: 'private nurse near me',
  },
  {
    icon: Heart,
    name: 'Home Healthcare Coordination',
    slug: 'home-healthcare-coordination',
    tagline: 'Ongoing in-home clinical support.',
    description:
      'For patients who need recurring care at home: skilled nursing, recovery monitoring, medication management, and more — coordinated through our licensed provider network.',
    intent: 'in home healthcare coordination',
  },
  {
    icon: Heart,
    name: 'Senior Care Navigation',
    slug: 'senior-care-navigation',
    tagline: 'We coordinate care for aging parents — so you don\'t have to navigate it alone.',
    description:
      'Built for the adult child managing a parent\'s care from a distance. We help identify appropriate providers, coordinate visits, and communicate directly with your family.',
    intent: 'help finding care for elderly parents',
  },
  {
    icon: Star,
    name: 'Concierge Healthcare Coordination',
    slug: 'concierge-healthcare-coordination',
    tagline: 'White-glove coordination for discerning patients.',
    description:
      'For executives, high-net-worth individuals, and VIP guests who expect discretion, speed, and a seamless experience — from first call to provider arrival.',
    intent: 'concierge doctor near me',
  },
  {
    icon: Car,
    name: 'Medical Transportation Coordination',
    slug: 'medical-transportation-coordination',
    tagline: 'Non-emergency medical transport, arranged.',
    description:
      'We coordinate non-emergency medical transportation for patients who need a licensed vehicle for appointments, discharges, or transfers — not just a ride-share.',
    intent: 'non emergency medical transport',
  },
  {
    icon: FlaskConical,
    name: 'Mobile Lab Coordination',
    slug: 'mobile-lab-coordination',
    tagline: 'Lab draws at your home, hotel, or office.',
    description:
      'Skip the lab waiting room. We connect you with independent mobile phlebotomists and lab services that come to you — results forwarded directly to your physician.',
    intent: 'mobile lab near me blood draw at home',
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

const ServicesPage: React.FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Private Healthcare Coordination Services | Vitalé Health Concierge</title>
        <meta
          name="description"
          content="Vitalé Health Concierge coordinates same-day mobile doctors, private nurses, senior care navigation, mobile labs, and more. We connect patients with independent licensed healthcare professionals — fast."
        />
        <meta
          name="keywords"
          content="healthcare coordination services, same day doctor, mobile doctor, private nurse, senior care navigation, concierge healthcare, mobile lab, medical transportation, home healthcare coordination"
        />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/services" />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>

      {/* ── BREADCRUMB ── */}
      <nav className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">Services</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Healthcare Coordination &amp; Access Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
            Private Healthcare Coordination Services
          </h1>
          <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
            Vitalé Health Concierge helps individuals and families quickly connect with independent healthcare professionals and private-pay healthcare services. We coordinate — you get care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_24px_hsl(var(--brand-gold)/0.5)]"
            >
              <Phone className="h-5 w-5" /> {PHONE_NUMBER}
            </a>
          </div>
          <p className="text-white/40 text-xs">
            Available 24/7 · Real coordinator answers · No hold queues
          </p>
          <div className="flex items-start gap-2 text-xs text-amber-400/70">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>For medical emergencies, call 911 or go to your nearest emergency department.</span>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair">
            What Vitalé Does
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            We are not a clinic. We do not employ physicians. Vitalé is a healthcare coordination and access platform — we help patients find, connect with, and schedule independent licensed healthcare professionals who fit their specific situation, location, and clinical need.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            Whether you need a physician at your hotel room today, a nurse for a parent's post-surgical recovery, or a mobile lab draw at your office — Vitalé coordinates the access. The provider delivers the care.
          </p>
        </div>
      </section>

      {/* ── SERVICE CARDS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">
            Coordination Services
          </h2>
          <p className="text-muted-foreground mb-10">
            Choose a service area to learn what we coordinate and how the process works.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {SERVICES.map(({ icon: Icon, name, slug, tagline, description }) => (
              <Link
                key={slug}
                to={`/services/${slug}`}
                className="group rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">{tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary mt-auto">
                  Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW COORDINATION WORKS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3 text-center">
            How Coordination Works
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Every service follows the same four-step process.
          </p>

          <div className="space-y-4">
            {[
              { num: '1', title: 'Call Vitalé', body: `Reach us at ${PHONE_NUMBER} any time, day or night. A real coordinator — not an automated system — answers your call.` },
              { num: '2', title: 'Tell Us What You Need', body: 'Describe your clinical situation, your location, and how urgently you need care. We ask the right questions so we can match you correctly.' },
              { num: '3', title: 'We Coordinate with the Right Provider', body: 'We identify an independent licensed professional in our network who fits your need and geography, and connect them to your request.' },
              { num: '4', title: 'The Provider Contacts You Directly', body: 'The provider confirms their availability, visit window, and clinical scope before arriving. You know exactly who is coming and when.' },
            ].map(step => (
              <div key={step.num} className="bg-card border border-border rounded-xl px-7 py-6 flex items-start gap-5">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_20px_hsl(var(--brand-gold)/0.4)]"
            >
              <Phone className="h-5 w-5" /> Call {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* ── LANGUAGE NOTICE ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Important:</strong> Vitalé Health Concierge is a coordination and access platform, not a clinical provider. We do not employ, supervise, or control the independent licensed healthcare professionals in our network. All clinical decisions are made by the provider, not Vitalé. For life-threatening emergencies, call 911 or go to the nearest emergency department immediately.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-white/70 text-lg">
            Call us and describe your situation. Our coordinators will tell you exactly what we can help with and how quickly.
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
        </div>
      </section>
    </MainLayout>
  );
};

export default ServicesPage;
