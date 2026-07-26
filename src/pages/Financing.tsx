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
  CreditCard,
  ShieldCheck,
  Clock,
  Lock,
  AlertTriangle,
} from 'lucide-react';

const PHONE_NUMBER = '(888) 400-2273';
const PHONE_HREF = 'tel:+18884002273';

const WHY_PRIVATE_PAY = [
  {
    icon: Clock,
    title: 'No Prior Authorization Delays',
    body: 'Insurance-based care often requires prior authorization before a provider can see you — a process that can take days or longer. Private-pay skips that entirely. You call, we coordinate, the provider comes.',
  },
  {
    icon: Lock,
    title: 'Privacy',
    body: 'Insurance claims create a permanent record with your insurer. Private-pay visits stay between you and the provider. No claims data shared with third parties, no impact on future coverage rates.',
  },
  {
    icon: ShieldCheck,
    title: 'No Network Restrictions',
    body: 'Insurance networks limit which providers can see you. Private-pay removes that constraint — we coordinate the right provider for your clinical need, not whoever happens to be in-network.',
  },
  {
    icon: CreditCard,
    title: 'Transparent Flat-Rate Pricing',
    body: 'You know exactly what you\'re paying before any service begins. No surprise bills. No EOBs. No months-later invoices from providers you didn\'t realize were out-of-network.',
  },
];

const PAYMENT_METHODS = [
  'All major credit and debit cards',
  'Health Savings Account (HSA)',
  'Flexible Spending Account (FSA)',
  'Health Reimbursement Arrangement (HRA)',
  'Wire transfer',
  'Corporate / family office billing (on request)',
];

const FAQS = [
  {
    q: 'How does Vitalé\'s pricing work?',
    a: 'There are two components: a Vitalé coordination fee, and the independent provider\'s clinical visit fee. Both are disclosed to you before any service is confirmed — no surprises. You never pay anything until you\'ve agreed to the full cost.',
  },
  {
    q: 'Can I use my HSA or FSA to pay?',
    a: 'In most cases, yes. Clinical visit fees charged by the independent licensed provider are generally HSA/FSA-eligible medical expenses. The Vitalé coordination fee may also be eligible depending on your plan administrator\'s interpretation. We recommend confirming with your plan administrator for your specific account.',
  },
  {
    q: 'Can I submit a claim to my insurance after the visit?',
    a: 'Some providers in our network can provide a superbill — an itemized receipt that you can submit to your insurance company for potential out-of-network reimbursement. Whether your plan reimburses is between you and your insurer; we cannot guarantee reimbursement. Ask when you call and we\'ll clarify what\'s available for your specific coordination.',
  },
  {
    q: 'Is there a membership or subscription fee to use Vitalé?',
    a: 'No. Vitalé does not require a membership to access coordination services. You pay per coordination. If we cannot connect you with an appropriate provider, you owe nothing.',
  },
  {
    q: 'What is the typical price range for a coordinated visit?',
    a: 'Pricing varies by service type, provider, and market. Mobile physician visits typically range from a few hundred dollars per visit. IV therapy and nursing visits vary similarly. We provide a full cost breakdown before you commit — call us and we\'ll give you a realistic range for your specific request.',
  },
  {
    q: 'Do you accept insurance directly?',
    a: 'No. Vitalé does not bill insurance and does not accept insurance payments. We are a private-pay coordination platform. If your situation requires insurance-covered care, a traditional urgent care clinic or your primary care physician\'s office would be the appropriate path.',
  },
  {
    q: 'Can my company or family office be billed directly?',
    a: 'Corporate billing arrangements are available for executive healthcare programs and family office accounts. Call us to discuss a recurring coordination arrangement and billing setup.',
  },
];

const Financing: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        <title>Private-Pay Pricing & Payment Options | Vitalé Health Concierge</title>
        <meta
          name="description"
          content="Vitalé Health Concierge operates on a transparent private-pay model. No insurance billing. No surprise costs. HSA/FSA accepted. Learn how pricing works and why private-pay is the right choice for our patients."
        />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/financing" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* ── BREADCRUMB ── */}
      <nav className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">Pricing & Payment</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Transparent · Private-Pay · No Surprises
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
            You Know What You Pay Before We Begin
          </h1>
          <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
            Vitalé operates on a private-pay model. No insurance billing. No claims processes. No surprise invoices weeks later. A clear coordination fee and a transparent provider fee — both disclosed before you commit.
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
            Call for a cost estimate before committing to any service.
          </p>
        </div>
      </section>

      {/* ── HOW PRICING WORKS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">How Pricing Works</h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
              Every Vitalé coordination involves two separate, fully disclosed fees. You agree to both before any provider is dispatched.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-border bg-card p-7 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-base">Vitalé Coordination Fee</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is our fee for identifying, contacting, and connecting the appropriate independent licensed provider to your request. It covers 24/7 coordinator availability, provider vetting, and logistics management. Disclosed upfront before any commitment.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-base">Provider's Clinical Visit Fee</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The independent licensed provider sets their own clinical fee. This is paid directly to — or facilitated through — the provider for the clinical service they deliver. This fee is also communicated before you confirm the visit.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-7 py-5 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">
              <strong>No hidden fees.</strong> If a visit requires additional services beyond the original scope, any additional charges are communicated by the provider before they proceed — never billed after the fact without your knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* ── PAYMENT METHODS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Accepted Payment Methods</h2>
          <p className="text-muted-foreground mb-8 max-w-xl">
            We accept most major payment types. HSA and FSA payments are accepted — making this accessible for patients with health spending accounts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {PAYMENT_METHODS.map(method => (
              <div key={method} className="flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-4">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{method}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-card border border-border px-6 py-5 max-w-2xl">
            <p className="text-sm font-semibold mb-1">HSA / FSA Eligibility Note</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Clinical visit fees charged by independent licensed providers are generally eligible medical expenses under HSA, FSA, and HRA plans. Vitalé coordination fees may also qualify depending on your plan administrator. We recommend confirming with your account administrator. Providers can supply itemized receipts for your records.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY PRIVATE PAY ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">
            Why Private-Pay Is the Right Choice Here
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            For patients who need care fast — at their location, on their schedule — private-pay isn't a compromise. It's an advantage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_PRIVATE_PAY.map(({ icon: Icon, title, body }) => (
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

      {/* ── SUPERBILL SECTION ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Superbills for Insurance Submission</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
            If you have a PPO or out-of-network insurance benefit, you may be able to recover a portion of your clinical visit cost by submitting a superbill.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: '1', title: 'Provider Issues a Superbill', body: 'After the visit, the independent provider issues an itemized receipt that includes procedure codes, diagnosis codes, and provider credentials — everything your insurer needs to process a claim.' },
              { step: '2', title: 'You Submit to Your Insurer', body: 'You submit the superbill directly to your insurance company as an out-of-network claim. Processing timelines and reimbursement amounts depend entirely on your plan.' },
              { step: '3', title: 'Insurer Pays You Directly', body: 'If your plan includes out-of-network benefits, any reimbursement goes directly to you — not Vitalé. You\'ve already paid the provider; the insurer simply refunds part of that cost.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {step}
                </div>
                <h3 className="font-bold text-sm">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Not all providers in our network issue superbills. Mention this requirement when you call and we will do our best to identify an appropriate provider.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-3">Pricing FAQs</h2>
          <p className="text-muted-foreground mb-10">Common questions about how private-pay coordination works.</p>

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

      {/* ── DISCLAIMER ── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-muted/40 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
            <p className="leading-relaxed">
              Pricing information on this page is general guidance only. Actual coordination fees and provider fees are disclosed at the time of your request. HSA/FSA eligibility is subject to your plan administrator's determination. Superbill reimbursement is not guaranteed and depends entirely on your insurance plan's out-of-network benefits. Vitalé Health Concierge does not provide insurance advice.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair">
            Want a Cost Estimate First?
          </h2>
          <p className="text-white/70 text-lg">
            Call us before committing. Describe what you need and we'll give you a realistic cost range — coordination fee and estimated provider fee — before any service begins.
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl md:text-3xl px-10 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_6px_30px_hsl(var(--brand-gold)/0.5)]"
          >
            <Phone className="h-7 w-7" /> {PHONE_NUMBER}
          </a>
          <p className="text-white/40 text-sm">
            Available 24/7 · No commitment required to get a quote
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

export default Financing;
