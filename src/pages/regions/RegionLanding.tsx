import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const REGIONS: Record<string, Record<string, { headline: string; sub: string }>> = {
  CA: {
    'santa-clara': {
      headline: 'Private Concierge Care in Santa Clara County',
      sub: 'Discreet in‑home nursing, physician‑led wellness, and priority placement across Atherton, Palo Alto, and Los Altos Hills.'
    },
    'san-mateo': {
      headline: 'Concierge Nursing & Placement in San Mateo County',
      sub: 'White‑glove coordination from Burlingame to Woodside—trusted by private families and care managers.'
    },
    'marin': {
      headline: 'Physician‑Backed Concierge Care in Marin County',
      sub: 'Bespoke care throughout Belvedere, Tiburon, Kentfield, and Ross—on your schedule.'
    }
  },
  TX: {
    'travis': {
      headline: 'Private, Priority Care in Travis County',
      sub: 'Executive‑level health coordination across Westlake, Barton Creek, and Rollingwood.'
    },
    'collin': {
      headline: 'Concierge Health Services in Collin County',
      sub: 'Discreet support for families in West Plano, Frisco, and McKinney.'
    }
  }
};

const toTitle = (s: string) => s.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

const RegionLanding: React.FC = () => {
  const { state, county } = useParams();
  const s = (state || '').toUpperCase();
  const c = (county || '').toLowerCase();
  const cfg = REGIONS[s]?.[c];

  const title = cfg ? cfg.headline : `Private Concierge Care in ${toTitle(c)}, ${s}`;
  const desc = cfg?.sub || 'Discreet in‑home nursing, bespoke wellness, and white‑glove placement—precisely when you need it.';

  return (
    <MainLayout>
      <Helmet>
        <title>{title} | Vitalé</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://vitalehealthconcierge.doctor/regions/${state}/${county}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Private Concierge Care',
            areaServed: `${toTitle(c)}, ${s}`,
            provider: { '@type': 'Organization', name: 'Vitalé Health Concierge' }
          })}
        </script>
      </Helmet>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-playfair font-semibold">{title}</h1>
          <p className="text-xl text-muted-foreground">{desc}</p>
          <div className="flex gap-4 pt-2">
            <Button variant="luxury" size="lg">Speak to Concierge</Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/marketplace">Explore Concierge Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default RegionLanding;
