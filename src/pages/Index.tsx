import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Helmet } from 'react-helmet';
import { 
  Home, 
  Droplet, 
  Heart, 
  Activity, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Phone, 
  MessageSquare 
} from 'lucide-react';
import { useQuickIntakeForm } from '@/hooks/useQuickIntakeForm';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const { formData, updateField, submitForm, isSubmitting } = useQuickIntakeForm();

  const handleDashboardClick = () => {
    if (isLoading) return; // Prevent action while loading
    
    if (isAuthenticated) {
      if (userRole === 'professional') {
        navigate('/dashboard/professional');
      } else if (userRole === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Private, Physician‑Backed Concierge Care | Vitalé</title>
        <meta name="description" content="Discreet in‑home nursing, bespoke wellness, and white‑glove placement—precisely when you need it." />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/" />
      </Helmet>
      {/* 1. Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight font-playfair">
                Private, Physician‑Backed Concierge Care for Distinguished Families.
              </h1>
              <p className="text-xl text-muted-foreground">
                Discreet in‑home nursing, bespoke wellness, and white‑glove placement—precisely when you need it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="luxury">
                  Schedule a Private Consultation
                </Button>
                <Button size="lg" variant="outline">
                  Explore Concierge Services
                </Button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-[var(--shadow-elegant)] border border-border">
              <img
                src="https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg"
                alt="Discreet in‑home nursing in a luxury residence"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </section>
        {/* Affluent counties strip */}
        <section className="pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-3">Trusted across California and Texas</p>
            <div className="flex flex-wrap gap-2">
              {['Beverly Hills','Bel Air','Marin','Palo Alto','San Mateo','Newport Coast','Westlake','River Oaks','The Woodlands','Westlake Austin'].map((c)=> (
                <span key={c} className="text-xs px-3 py-1 rounded-full border border-border bg-card text-foreground/80">{c}</span>
              ))}
            </div>
          </div>
        </section>

      {/* 2. What We Offer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
            <p className="mt-4 text-xl text-gray-600">
              One trusted platform. Vetted providers. Nationwide access starting in CA & TX.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Home className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">In-Home Elder Care</h3>
              <p className="text-gray-600">Professional caregivers providing personalized support in the comfort of home.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Droplet className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Concierge IV Therapy</h3>
              <p className="text-gray-600">Mobile hydration and vitamin infusions delivered by licensed nurses.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Private Hospice Services</h3>
              <p className="text-gray-600">Compassionate end-of-life care with dignity and personalized attention.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wellness & Recovery Plans</h3>
              <p className="text-gray-600">Customized health programs for post-surgery recovery and ongoing wellness.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Memory & Cognitive Support</h3>
              <p className="text-gray-600">Specialized care for those with Alzheimer's, dementia, and cognitive challenges.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Placement Matching</h3>
              <p className="text-gray-600">Rapid response placement services for urgent care needs and transitions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Offer Stack */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--brand-ink))] text-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-semibold mb-3">
              Exclusive Benefits
            </span>
            <h2 className="text-3xl font-playfair font-semibold">The Vitalé Advantage</h2>
            <p className="mt-3 text-white/80 text-lg">
              Private coordination, priority access, and white‑glove execution.
            </p>
          </div>
          <div className="rounded-xl p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ['First‑time Clients: Up to $250 off','Your first concierge booking'],
                ['Priority Fast‑Track Placement','24–48hr turnarounds for urgent needs'],
                ['Private Care Coordination','Your dedicated coordinator, 24/7'],
                ['Physician‑Led Oversight','Executive health, guided by physicians']
              ].map(([title,sub]) => (
                <div className="flex items-start gap-3" key={title}>
                  <span className="mt-1 h-6 w-6 rounded-full border border-white/20 inline-flex items-center justify-center text-xs">✓</span>
                  <div>
                    <h3 className="font-medium text-lg">{title}</h3>
                    <p className="text-white/70">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" variant="luxury" className="px-8">
                Claim My Concierge Offer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Your path to premium care is simple and streamlined
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-4">Tell Us Your Need</h3>
              <p className="text-gray-600">Share your requirements for in-home nursing, IV therapy, hospice care, or assisted living placement.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-4">We Match You</h3>
              <p className="text-gray-600">Our concierge team pairs you with the perfect provider from our vetted private network.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-4">Care Delivered Fast</h3>
              <p className="text-gray-600">Book, track, and access support through our platform with 24/7 concierge assistance.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 text-xl text-gray-600">
              Trusted by families across California & Texas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "The IV therapy service was exceptional. The nurse arrived promptly, was professional, and made my mother feel comfortable. The hydration therapy made a noticeable difference in her energy levels."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  JM
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Jennifer M.</p>
                  <p className="text-sm text-gray-500">San Mateo County, CA</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "When my father needed hospice care, Vitale matched us with the most compassionate team. Their attention to detail and 24/7 availability gave our family peace of mind during a difficult time."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  RW
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Robert W.</p>
                  <p className="text-sm text-gray-500">Travis County, TX</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "The VIP Fast-Track Placement service was worth every penny. Within 36 hours, they found the perfect assisted living facility for my mother, handled all the paperwork, and coordinated the move."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  SL
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Sarah L.</p>
                  <p className="text-sm text-gray-500">Orange County, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Lead Capture / Booking CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to Experience Concierge Healthcare?</h2>
              <p className="text-xl text-indigo-100 mb-6">
                Schedule a free consultation with our concierge team to discuss your needs and discover how we can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                  Schedule My Concierge Call
                </Button>
                <Button size="lg" variant="outline" className="border-white text-indigo-700 hover:bg-indigo-50">
                  Book Urgent Care Now
                </Button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Quick Intake Form</h3>
              <form 
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await submitForm();
                }}
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <Input 
                    id="name" 
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Your name" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70" 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="your@email.com" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70" 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 123-4567" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70" 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium mb-1">Zip Code</label>
                  <Input 
                    id="zip" 
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    placeholder="90210" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70" 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium mb-1">Service Needed</label>
                  <select 
                    id="service" 
                    value={formData.serviceNeeded}
                    onChange={(e) => updateField('serviceNeeded', e.target.value)}
                    className="w-full rounded-md bg-white/20 border-white/30 text-white p-2 placeholder:text-white/70"
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-indigo-700 text-white">Select a service</option>
                    <option value="in-home-care" className="bg-indigo-700 text-white">In-Home Care</option>
                    <option value="iv-therapy" className="bg-indigo-700 text-white">IV Therapy</option>
                    <option value="hospice" className="bg-indigo-700 text-white">Hospice Care</option>
                    <option value="placement" className="bg-indigo-700 text-white">Assisted Living Placement</option>
                    <option value="other" className="bg-indigo-700 text-white">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium mb-1">Urgency</label>
                  <select 
                    id="urgency" 
                    value={formData.urgency}
                    onChange={(e) => updateField('urgency', e.target.value)}
                    className="w-full rounded-md bg-white/20 border-white/30 text-white p-2 placeholder:text-white/70"
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-indigo-700 text-white">Select urgency</option>
                    <option value="urgent" className="bg-indigo-700 text-white">Urgent (24-48 hours)</option>
                    <option value="soon" className="bg-indigo-700 text-white">Soon (This week)</option>
                    <option value="planning" className="bg-indigo-700 text-white">Planning (Within a month)</option>
                  </select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-white text-indigo-700 hover:bg-indigo-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;