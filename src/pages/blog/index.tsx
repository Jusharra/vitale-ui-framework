import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const BlogIndex = () => {
  // County-specific blog posts
  const countyPosts = [
    {
      id: 1,
      title: "Concierge IV Therapy & Private Hospice Care in San Mateo County",
      excerpt: "Premium IV hydration therapy and compassionate hospice care delivered directly to your doorstep in Atherton, Menlo Park, Hillsborough, and beyond.",
      slug: "iv-therapy-hospice-san-mateo-county",
      image: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg",
      date: "May 20, 2025",
      category: "California"
    },
    {
      id: 2,
      title: "Concierge IV Therapy & Private Hospice Care in Marin County",
      excerpt: "Luxury healthcare services for Marin County's discerning residents in Tiburon, Ross, Belvedere, Mill Valley, and Kentfield.",
      slug: "iv-therapy-hospice-marin-county",
      image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
      date: "May 19, 2025",
      category: "California"
    },
    {
      id: 3,
      title: "Concierge IV Therapy & Private Hospice Care in Orange County",
      excerpt: "Exclusive healthcare services for Orange County's coastal elite in Newport Beach, Laguna Beach, Corona del Mar, and beyond.",
      slug: "iv-therapy-hospice-orange-county",
      image: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg",
      date: "May 18, 2025",
      category: "California"
    },
    {
      id: 4,
      title: "Concierge IV Therapy & Private Hospice Care in Santa Clara County",
      excerpt: "Silicon Valley's premier healthcare services for Los Altos Hills, Palo Alto, Saratoga, and surrounding communities.",
      slug: "iv-therapy-hospice-santa-clara-county",
      image: "https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg",
      date: "May 17, 2025",
      category: "California"
    },
    {
      id: 5,
      title: "Concierge IV Therapy & Private Hospice Care in Collin County",
      excerpt: "Exclusive healthcare services for Collin County's affluent communities in Frisco, Plano, Prosper, and beyond.",
      slug: "iv-therapy-hospice-collin-county",
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg",
      date: "May 16, 2025",
      category: "Texas"
    },
    {
      id: 6,
      title: "Concierge IV Therapy & Private Hospice Care in Westlake & Tarrant County",
      excerpt: "Luxury healthcare services for Westlake, Southlake, Colleyville, and surrounding Tarrant County areas.",
      slug: "iv-therapy-hospice-westlake-tarrant-county",
      image: "https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg",
      date: "May 15, 2025",
      category: "Texas"
    },
    {
      id: 7,
      title: "Concierge IV Therapy & Private Hospice Care in Los Angeles County",
      excerpt: "Elite healthcare services for Los Angeles County's most exclusive neighborhoods in Beverly Hills, Bel Air, and Malibu.",
      slug: "iv-therapy-hospice-los-angeles-county",
      image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
      date: "May 14, 2025",
      category: "California"
    },
    {
      id: 8,
      title: "Concierge IV Therapy & Private Hospice Care in Williamson County",
      excerpt: "Exclusive healthcare services for Williamson County's growing luxury communities in Georgetown, Round Rock, and Cedar Park.",
      slug: "iv-therapy-hospice-williamson-county",
      image: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg",
      date: "May 13, 2025",
      category: "Texas"
    },
    {
      id: 9,
      title: "Concierge IV Therapy & Private Hospice Care in Travis County",
      excerpt: "Premium healthcare services for Travis County's most prestigious neighborhoods in Westlake Hills, Rollingwood, and Barton Creek.",
      slug: "iv-therapy-hospice-travis-county",
      image: "https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg",
      date: "May 12, 2025",
      category: "Texas"
    },
    {
      id: 10,
      title: "Concierge IV Therapy & Private Hospice Care in Montgomery County",
      excerpt: "Exclusive healthcare services for Montgomery County's prestigious communities in The Woodlands, Carlton Woods, and Magnolia.",
      slug: "iv-therapy-hospice-montgomery-county",
      image: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg",
      date: "May 11, 2025",
      category: "Texas"
    },
    {
      id: 11,
      title: "Concierge IV Therapy & Private Hospice Care in Contra Costa County",
      excerpt: "Premium healthcare services for Contra Costa County's prestigious communities in Alamo, Danville, and Orinda.",
      slug: "iv-therapy-hospice-contra-costa-county",
      image: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg",
      date: "May 10, 2025",
      category: "California"
    },
    {
      id: 12,
      title: "Concierge IV Therapy & Private Hospice Care in San Diego County",
      excerpt: "Exclusive healthcare services for San Diego County's coastal elite in La Jolla, Rancho Santa Fe, and Del Mar.",
      slug: "iv-therapy-hospice-san-diego-county",
      image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
      date: "May 9, 2025",
      category: "California"
    },
    {
      id: 13,
      title: "Concierge IV Therapy & Private Hospice Care in Ventura County",
      excerpt: "Premium healthcare services for Ventura County's prestigious communities in Westlake Village, Thousand Oaks, and Ojai.",
      slug: "iv-therapy-hospice-ventura-county",
      image: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg",
      date: "May 8, 2025",
      category: "California"
    },
    {
      id: 14,
      title: "Concierge IV Therapy & Private Hospice Care in Fort Bend County",
      excerpt: "Exclusive healthcare services for Fort Bend County's prestigious communities in Sugar Land, Missouri City, and Richmond.",
      slug: "iv-therapy-hospice-fort-bend-county",
      image: "https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg",
      date: "May 7, 2025",
      category: "Texas"
    }
  ];

  // General blog posts
  const generalPosts = [
    {
      id: 101,
      title: "The Benefits of IV Hydration Therapy for Executive Performance",
      excerpt: "Discover how IV hydration therapy can enhance cognitive function, energy levels, and overall performance for busy executives.",
      slug: "#",
      image: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg",
      date: "May 5, 2025",
      category: "IV Therapy"
    },
    {
      id: 102,
      title: "Understanding End-of-Life Care Options: Hospice vs. Palliative Care",
      excerpt: "Learn the differences between hospice and palliative care to make informed decisions for your loved ones.",
      slug: "#",
      image: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg",
      date: "May 3, 2025",
      category: "Hospice Care"
    },
    {
      id: 103,
      title: "The Science Behind IV Vitamin Therapy: Separating Fact from Fiction",
      excerpt: "An evidence-based look at the benefits and limitations of intravenous vitamin therapy for wellness and health optimization.",
      slug: "#",
      image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
      date: "May 1, 2025",
      category: "IV Therapy"
    }
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>Concierge IV Therapy & Hospice Care Blog | Vitale Health</title>
        <meta name="description" content="Expert insights on luxury IV hydration therapy and private hospice care services in California and Texas' most affluent communities." />
      </Helmet>

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Concierge Health & Wellness Insights
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Expert articles on IV hydration therapy, hospice care, and premium wellness services for discerning clients.
            </p>
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search articles..." 
                className="pl-10 w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm">All</Button>
              <Button variant="outline" size="sm">California</Button>
              <Button variant="outline" size="sm">Texas</Button>
              <Button variant="outline" size="sm">IV Therapy</Button>
              <Button variant="outline" size="sm">Hospice Care</Button>
            </div>
          </div>

          {/* Featured Post */}
          <div className="mt-12">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg" 
                alt="Featured post" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-10">
                <span className="text-indigo-300 text-sm font-semibold mb-2">FEATURED</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Luxury IV Therapy & Hospice Care: The Future of Concierge Healthcare
                </h2>
                <p className="text-gray-200 mb-4 max-w-3xl">
                  Discover how personalized IV hydration therapy and private hospice care are transforming healthcare experiences for affluent communities across California and Texas.
                </p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg" 
                      alt="Author"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Dr. Elizabeth Morgan</p>
                    <div className="flex space-x-1 text-xs text-gray-300">
                      <time dateTime="2025-05-22">May 22, 2025</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>10 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* County-Specific Blog Posts */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Concierge Services by Location</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {countyPosts.map((post) => (
                <div key={post.id} className="flex flex-col rounded-lg shadow-sm overflow-hidden">
                  <div className="flex-shrink-0">
                    <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600">
                        {post.category}
                      </p>
                      <Link to={`/blog/${post.slug}`} className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                        <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                      </Link>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <span className="sr-only">Vitale Health</span>
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                          VH
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Vitale Health</p>
                        <div className="flex space-x-1 text-xs text-gray-500">
                          <time dateTime={post.date}>{post.date}</time>
                          <span aria-hidden="true">&middot;</span>
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Blog Posts */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Wellness Insights</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {generalPosts.map((post) => (
                <div key={post.id} className="flex flex-col rounded-lg shadow-sm overflow-hidden">
                  <div className="flex-shrink-0">
                    <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600">
                        {post.category}
                      </p>
                      <a href={post.slug} className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                        <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                      </a>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <span className="sr-only">Vitale Health</span>
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                          VH
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Vitale Health</p>
                        <div className="flex space-x-1 text-xs text-gray-500">
                          <time dateTime={post.date}>{post.date}</time>
                          <span aria-hidden="true">&middot;</span>
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-20 bg-indigo-50 rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Subscribe to Our Newsletter</h3>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Stay up-to-date with the latest health insights, tips, and news delivered straight to your inbox.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="max-w-md sm:max-w-xs"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogIndex;