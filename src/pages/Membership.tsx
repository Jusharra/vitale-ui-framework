import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import PublicStripeSubscriptionButton from '@/components/payments/PublicStripeSubscriptionButton';
import {
  Phone,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Star,

  UserCheck,
  ShieldCheck,
  Zap,
  Users,
} from 'lucide-react';

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF = 'tel:+18884002273';

const FEATURES = [
  {
    icon: UserCheck,
    title: 'Dedicated Care Coordinator',
    body: 'A single coordinator who knows your preferences, your family\'s situation, and your history — so you\'re never re-explaining yourself from scratch.',
  },
  {
    icon: Zap,
    title: 'Priority Dispatch',
    body: 'When multiple requests compete for the same provider window, members are placed first. Same-day availability when you need it most.',
  },
  {
    icon: CheckCircle,
    title: 'Coordination Fees Included',
    body: 'Per-visit Vitalé coordination fees are included in your membership. You pay the provider\'s clinical fee — we waive our coordination charge.',
  },
  {
    icon: Star,
    title: 'White-Glove Provider Matching',
    body: 'We maintain preferred provider relationships on your behalf — physicians and nurses who already know your care preferences and can mobilize faster.',
  },
  {
    icon: Phone,
    title: '24/7 Priority Member Line',
    body: 'A dedicated member line — separate from our general inbound queue — answered by a senior coordinator, any time of day or night.',
  },
  {
    icon: Users,
    title: 'Family Coverage',
    body: 'Your membership extends to your immediate household. One retainer covers coordination for all family members at your primary residence.',
  },
];

const COMPARISON = [
  { feature: 'Access to coordination network', perVisit: true, member: true },
  { feature: 'Same-day provider coordination', perVisit: true, member: true },
  { feature: '24/7 coordinator access', perVisit: true, member: true },
  { feature: 'Vitalé coordination fee waived', perVisit: false, member: true },
  { feature: 'Dedicated personal coordinator', perVisit: false, member: true },
  { feature: 'Priority dispatch queue', perVisit: false, member: true },
  { feature: 'Preferred provider relationships maintained', perVisit: false, member: true },
  { feature: 'Family household coverage', perVisit: false, member: true },
  { feature: '24/7 priority member line', perVisit: false, member: true },
];

const FAQS = [
  {
    q: 'What is included in the membership?',
    a: 'Membership includes a dedicated care coordinator, Vitalé coordination fees waived on all coordinations, priority dispatch placement, preferred provider matching, 24/7 access to a dedicated member line, and family household coverage. You still pay the independent provider\'s clinical visit fee — membership does not cover the provider\'s charges.',
  },
  {
    q: 'What is the difference between membership and using Vitalé per visit?',
    a: 'Per-visit patients pay a Vitalé coordination fee each time they request a service. Members have that fee waived and receive a dedicated coordinator, priority queue placement, and preferred provider relationships maintained on their behalf. If you coordinate care frequently — monthly or more — membership typically pays for itself.',
  },
  {
    q: 'Does membership cover the provider\'s clinical fees?',
    a: 'No. The independent provider\'s clinical visit fee is always separate and is paid directly for each visit. Membership covers Vitalé\'s coordination fee and the priority access benefits listed above — not the provider\'s charges.',
  },
  {
    q: 'Can I cancel my membership?',
    a: 'Yes. Membership is month-to-month with no long-term contract. You can cancel at any time and your access continues through the end of your current billing period.',
  },
  {
    q: 'Does my membership cover my family?',
    a: 'Yes. Your membership covers immediate family members at your primary household. If you need coverage for a parent or family member at a separate residence, contact us to discuss a coordination arrangement.',
  },
  {
    q: 'Is there a contract or commitment period?',
    a: 'No. Month-to-month billing only. Annual billing is available at a reduced rate and can be cancelled with a prorated refund for unused months.',
  },
  {
    q: 'I already use Vitalé per-visit. How do I upgrade?',
    a: 'Call us or sign up below. Your dedicated coordinator will be assigned within one business day of your first payment processing.',
  },
];

const monthlyPrice = 1297;
const yearlyPrice = 15564;

const Membership: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const displayPrice = isYearly ? yearlyPrice : monthlyPrice;
  const displayInterval = isYearly ? '/year' : '/mo';
  const interval = isYearly ? 'yearly' : 'monthly';
  const yearlySavings = monthlyPrice * 12 - yearlyPrice;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Priority Membership — Healthcare Coordination on Retainer | Vitalé Health Concierge</title>
        <meta
          name="description"
          content="Vitalé membership gives you a dedicated coordinator, waived coordination fees, priority dispatch, and 24/7 member access — on a month-to-month retainer with no long-term contract."
        />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/membership" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* ── BREADCRUMB ── */}
      <nav className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">Membership</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Priority Access · Dedicated Coordinator · On Retainer
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
            Healthcare Coordination,<br className="hidden sm:block" /> Reserved for You.
          </h1>
          <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
            Membership gives you a dedicated coordinator who knows your situation, waived coordination fees on every request, and priority placement when you need a provider fast. Month-to-month. No contracts.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#pricing"
              className="inline-flex items-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_24px_hsl(var(--brand-gold)/0.5)]"
            >
              View Pricing
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-3 border border-white/30 text-white font-semibold text-base px-6 py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              <Phone className="h-5 w-5" /> {PHONE_NUMBER}
            </a>
          </div>
          <p className="text-white/40 text-xs">
            Questions? Call us before signing up — we'll tell you whether membership makes sense for your situation.
          </p>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">
            Per-Visit vs. Membership
          </h2>
          <p className="text-muted-foreground mb-10">
            Both options give you access to our coordinated provider network. Membership adds dedicated service, waived fees, and priority access.
          </p>

          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/60 text-xs font-bold uppercase tracking-widest">
              <div className="px-5 py-3 text-muted-foreground">Feature</div>
              <div className="px-5 py-3 text-center text-muted-foreground">Per Visit</div>
              <div className="px-5 py-3 text-center text-primary">Member</div>
            </div>
            {COMPARISON.map(({ feature, perVisit, member }, idx) => (
              <div
                key={feature}
                className={`grid grid-cols-3 border-t border-border ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
              >
                <div className="px-5 py-3.5 text-sm text-foreground">{feature}</div>
                <div className="px-5 py-3.5 flex justify-center items-center">
                  {perVisit
                    ? <CheckCircle className="h-5 w-5 text-primary" />
                    : <span className="text-muted-foreground/40 text-lg">—</span>
                  }
                </div>
                <div className="px-5 py-3.5 flex justify-center items-center">
                  {member
                    ? <CheckCircle className="h-5 w-5 text-primary" />
                    : <span className="text-muted-foreground/40 text-lg">—</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">What Membership Includes</h2>
          <p className="text-muted-foreground mb-10">
            Every benefit listed below is included in your monthly or annual retainer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-base">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            <ShieldCheck className="inline h-4 w-4 text-primary mr-1.5 -mt-0.5" />
            Membership covers Vitalé's coordination fees. Independent provider clinical visit fees are always separate and disclosed before each visit.
          </p>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-background scroll-mt-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3 text-center">Membership Pricing</h2>
          <p className="text-muted-foreground text-center mb-10">
            Month-to-month. Cancel any time. Annual billing saves {Math.round((yearlySavings / (monthlyPrice * 12)) * 100)}%.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-2.5">
              <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Yearly
              </span>
              {isYearly && (
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Save ${yearlySavings.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="rounded-2xl border-2 border-primary bg-card overflow-hidden shadow-xl">
            <div className="bg-[hsl(var(--brand-ink))] text-white px-8 py-7">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Priority Membership</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold font-playfair">
                  ${displayPrice.toLocaleString()}
                </span>
                <span className="text-white/60 text-lg mb-1">{displayInterval}</span>
              </div>
              {isYearly && (
                <p className="text-sm text-white/60 mt-1">
                  ${Math.round(yearlyPrice / 12).toLocaleString()}/mo billed annually · Save ${yearlySavings.toLocaleString()}/year
                </p>
              )}
            </div>

            <div className="px-8 py-7 space-y-4">
              <ul className="space-y-3">
                {FEATURES.map(({ title }) => (
                  <li key={title} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{title}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <PublicStripeSubscriptionButton
                  tier="premium"
                  interval={interval}
                  buttonText="Become a Member"
                  className="w-full"
                  showFamilySelector={true}
                />
              </div>

              <p className="text-xs text-muted-foreground text-center pt-1">
                No long-term contract · Cancel any time · Provider clinical fees billed separately
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Not sure if membership is right for you?{' '}
              <a href={PHONE_HREF} className="text-primary font-semibold hover:underline">
                Call {PHONE_NUMBER}
              </a>{' '}
              and we'll be honest about whether it makes sense for your frequency of use.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Membership FAQs</h2>
          <p className="text-muted-foreground mb-10">Common questions about the priority membership.</p>

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
            Ready for Priority Access?
          </h2>
          <p className="text-white/70 text-lg">
            Join as a member or call us first — we'll give you an honest assessment of whether a retainer is the right fit for your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_24px_hsl(var(--brand-gold)/0.5)]"
            >
              View Membership Pricing
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold text-base px-6 py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              <Phone className="h-5 w-5" /> {PHONE_NUMBER}
            </a>
          </div>
          <p className="text-white/40 text-sm">
            <Link to="/services" className="hover:text-white/70 underline">Or use Vitalé per-visit — no membership required</Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Membership;
