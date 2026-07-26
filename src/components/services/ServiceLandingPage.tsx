import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import {
  Phone,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ServicePersona {
  label: string;
  headline: string;
  description: string;
}

export interface RelatedService {
  name: string;
  href: string;
}

export interface ServicePageConfig {
  slug: string;
  serviceName: string;
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  heroSub: string;
  intro: string;
  whoItIsFor: ServicePersona[];
  whatWeCoordinate: string[];
  faqs: { q: string; a: string }[];
  relatedServices?: RelatedService[];
}

// ─── Component ───────────────────────────────────────────────────────────────

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF = 'tel:+18884002273';

const ServiceLandingPage: React.FC<ServicePageConfig> = (cfg) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: cfg.serviceName,
    description: cfg.metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'Vitalé Health Concierge',
      url: 'https://vitalehealthconcierge.doctor',
      telephone: '+18884002273',
    },
    serviceType: 'Healthcare Coordination',
    url: cfg.canonicalUrl,
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{cfg.metaTitle}</title>
        <meta name="description" content={cfg.metaDescription} />
        <meta name="keywords" content={cfg.keywords} />
        <link rel="canonical" href={cfg.canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* ── BREADCRUMB ── */}
      <nav className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">{cfg.serviceName}</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Healthcare Coordination &amp; Access Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
            {cfg.h1}
          </h1>
          <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
            {cfg.heroSub}
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

      {/* ── WHAT THIS SERVICE IS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-5">
            What Is {cfg.serviceName}?
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base max-w-3xl">
            {cfg.intro}
          </p>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Who This Service Is For</h2>
          <p className="text-muted-foreground mb-10">
            Vitalé coordinates {cfg.serviceName.toLowerCase()} for patients and families in a range of situations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cfg.whoItIsFor.map(({ label, headline, description }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{label}</span>
                <h3 className="font-bold text-base leading-snug">{headline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE COORDINATE ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">What We Coordinate</h2>
          <p className="text-muted-foreground mb-8 max-w-xl">
            Through our network of independent licensed healthcare professionals, we connect patients with the following types of support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cfg.whatWeCoordinate.map(item => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span className="font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Don't see what you need?{' '}
            <a href={PHONE_HREF} className="text-primary font-semibold hover:underline">Call {PHONE_NUMBER}</a>
            {' '}— our coordinators can often find a match for unlisted needs.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3 text-center">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12">
            Four steps from your call to coordinated care.
          </p>

          <div className="space-y-3">
            {[
              { num: '1', title: 'Contact Vitalé', body: `Call ${PHONE_NUMBER} or submit a request online. A real coordinator answers 24/7 — no hold queues, no automated systems.` },
              { num: '2', title: 'Tell Us What You Need', body: 'Describe the type of healthcare support you\'re looking for — a physician visit, nursing care, lab draw, or anything else. Tell us your location and urgency.' },
              { num: '3', title: 'We Coordinate with an Appropriate Provider', body: 'We connect your request with an independent licensed healthcare professional in our network who fits your clinical need and geographic location.' },
              { num: '4', title: 'The Provider Confirms Availability and Care Details', body: 'The provider contacts you directly to confirm the visit window, location, and clinical scope before arriving.' },
            ].map((step, idx, arr) => (
              <React.Fragment key={step.num}>
                <div className="bg-card border border-border rounded-xl px-7 py-6 flex items-start gap-5">
                  <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ChevronDown className="h-5 w-5 text-primary/30" />
                  </div>
                )}
              </React.Fragment>
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

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-10">
            Common questions about {cfg.serviceName.toLowerCase()}.
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

      {/* ── RELATED SERVICES ── */}
      {cfg.relatedServices && cfg.relatedServices.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/40 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold mb-5">Related Services</h2>
            <div className="flex flex-wrap gap-3">
              {cfg.relatedServices.map(({ name, href }) => (
                <Link
                  key={href}
                  to={href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  {name} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair">
            Ready to Get Connected?
          </h2>
          <p className="text-white/70 text-lg">
            Call now and a coordinator will connect you with the right independent licensed provider for your situation.
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
            <Link to="/services" className="hover:text-white/70 underline">← All Services</Link>
            {' '}&nbsp;·&nbsp;{' '}
            <Link to="/" className="hover:text-white/70 underline">Main Site</Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default ServiceLandingPage;
