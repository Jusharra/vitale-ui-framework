import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Preventive Care: Why It Matters",
      excerpt: "Preventive care is one of the most important steps you can take to manage your health. Learn how regular check-ups and screenings can help detect problems before they start.",
      author: "Dr. Sarah Johnson",
      date: "May 15, 2025",
      category: "Wellness",
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Benefits of Telehealth Services in Modern Healthcare",
      excerpt: "Telehealth services have revolutionized how we access healthcare. Discover the advantages of virtual consultations and how they're improving patient outcomes.",
      author: "Dr. Michael Chen",
      date: "May 10, 2025",
      category: "Technology",
      image: "https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Nutrition Basics: Building a Balanced Diet",
      excerpt: "A balanced diet is fundamental to good health. Learn about the essential nutrients your body needs and how to incorporate them into your daily meals.",
      author: "Emily Roberts, RD",
      date: "May 5, 2025",
      category: "Nutrition",
      image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Managing Chronic Conditions: A Comprehensive Guide",
      excerpt: "Living with a chronic condition requires ongoing care and management. This guide provides strategies to help you effectively manage your health and improve your quality of life.",
      author: "Dr. James Wilson",
      date: "April 28, 2025",
      category: "Health Management",
      image: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Mental Health Matters: Self-Care Strategies for Busy Professionals",
      excerpt: "In today's fast-paced world, taking care of your mental health is crucial. Discover practical self-care strategies that fit into even the busiest schedules.",
      author: "Dr. Lisa Thompson",
      date: "April 20, 2025",
      category: "Mental Health",
      image: "https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "The Latest Advancements in Medical Technology",
      excerpt: "Medical technology continues to evolve at a rapid pace. Learn about the latest innovations that are transforming healthcare delivery and improving patient outcomes.",
      author: "Dr. Robert Davis",
      date: "April 15, 2025",
      category: "Technology",
      image: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      readTime: "7 min read"
    }
  ];

  // Categories for filtering
  const categories = [
    "All",
    "Wellness",
    "Technology",
    "Nutrition",
    "Health Management",
    "Mental Health"
  ];

  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Blog</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Health Insights & Resources
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Stay informed with the latest health news, tips, and expert advice from our healthcare professionals.
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
              {categories.map((category, index) => (
                <Button 
                  key={index} 
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          <div className="mt-12">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Featured post" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-10">
                <span className="text-indigo-300 text-sm font-semibold mb-2">FEATURED</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  The Future of Personalized Medicine: How AI is Transforming Healthcare
                </h3>
                <p className="text-gray-200 mb-4 max-w-3xl">
                  Artificial intelligence is revolutionizing how we approach healthcare, enabling more personalized treatment plans and improving patient outcomes.
                </p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Author"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Dr. Thomas Anderson</p>
                    <div className="flex space-x-1 text-xs text-gray-300">
                      <time dateTime="2025-05-20">May 20, 2025</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>10 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex flex-col rounded-lg shadow-sm overflow-hidden">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                      {post.category}
                    </p>
                    <a href="#" className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                      <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                    </a>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{post.author}</span>
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <div className="flex space-x-1 text-xs text-gray-500">
                        <time dateTime={post.date}>{post.date}</time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </a>
                <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </a>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      1
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      2
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      3
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      8
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      9
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      10
                    </a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </nav>
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

export default Blog;