import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Phone, Globe, FileText, Download, ExternalLink, Info, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define types for resources
interface Resource {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: string;
  state: string;
  county?: string;
  phone?: string;
  website?: string;
  eligibility?: string;
  documents_needed?: string[];
  tags?: string[];
}

// Define resource categories
const resourceCategories = [
  { id: 'financial', name: 'Financial Assistance' },
  { id: 'healthcare', name: 'Healthcare Programs' },
  { id: 'general_health', name: 'General Health Resources' },
  { id: 'mental_health', name: 'Mental Health & Wellness' },
  { id: 'preventive_care', name: 'Preventive Care' },
  { id: 'prescription', name: 'Prescription Assistance' },
  { id: 'emergency', name: 'Emergency Resources' },
  { id: 'housing', name: 'Housing Support' },
  { id: 'legal', name: 'Legal Services' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'meals', name: 'Meal Programs' },
  { id: 'caregiving', name: 'Caregiving Support' },
  { id: 'insurance', name: 'Insurance Programs' },
  { id: 'community', name: 'Community Services' },
];

// States and counties data
const statesAndCounties = {
  'California': [
    'San Mateo County', 'Marin County', 'Santa Clara County', 'San Francisco County',
    'Contra Costa County', 'Alameda County', 'Orange County', 'Los Angeles County',
    'San Diego County', 'Ventura County'
  ],
  'Texas': [
    'Travis County', 'Collin County', 'Tarrant County', 'Williamson County',
    'Fort Bend County', 'Montgomery County', 'Harris County', 'Dallas County'
  ]
};

// Mock resources data - in a real app, this would come from the database
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'California Medicaid (Medi-Cal)',
    description: 'Medi-Cal offers free or low-cost health coverage for children and adults with limited income and resources.',
    organization: 'California Department of Health Care Services',
    category: 'healthcare',
    state: 'California',
    phone: '1-800-541-5555',
    website: 'https://www.dhcs.ca.gov/services/medi-cal',
    eligibility: 'Income-based eligibility, varies by family size and county of residence.',
    documents_needed: ['Proof of identity', 'Proof of income', 'Proof of California residency', 'Social Security Number'],
    tags: ['medicaid', 'health insurance', 'low-income', 'seniors']
  },
  {
    id: '2',
    title: 'In-Home Supportive Services (IHSS)',
    description: 'IHSS provides assistance to eligible elderly, blind, and disabled individuals who are unable to remain safely in their homes without help.',
    organization: 'California Department of Social Services',
    category: 'caregiving',
    state: 'California',
    county: 'Los Angeles County',
    phone: '1-888-944-4477',
    website: 'https://www.cdss.ca.gov/in-home-supportive-services',
    eligibility: 'Must be 65 years or older, blind, or disabled and meet income requirements.',
    documents_needed: ['Medi-Cal eligibility', 'Medical verification of need', 'Proof of residence'],
    tags: ['home care', 'elderly', 'disabled', 'caregiving']
  },
  {
    id: '3',
    title: 'Texas Health and Human Services Commission (HHSC)',
    description: 'HHSC provides health coverage through programs such as Medicaid and the Children\'s Health Insurance Program (CHIP).',
    organization: 'Texas Health and Human Services',
    category: 'healthcare',
    state: 'Texas',
    phone: '1-877-541-7905',
    website: 'https://www.hhs.texas.gov/',
    eligibility: 'Varies by program, generally based on income, age, and disability status.',
    documents_needed: ['Proof of identity', 'Proof of income', 'Proof of Texas residency', 'Social Security Number'],
    tags: ['medicaid', 'health insurance', 'seniors', 'disability']
  },
  {
    id: '4',
    title: 'Community Care for the Elderly (CCE)',
    description: 'Provides community-based services to help frail elders remain in their homes, avoiding or delaying nursing home placement.',
    organization: 'California Department of Aging',
    category: 'community',
    state: 'California',
    county: 'San Mateo County',
    phone: '1-800-675-8437',
    website: 'https://aging.ca.gov/Programs_and_Services/',
    eligibility: 'Age 60 or older and functionally impaired.',
    documents_needed: ['Proof of age', 'Proof of residence', 'Medical assessment'],
    tags: ['elderly', 'home care', 'community services']
  },
  {
    id: '5',
    title: 'STAR+PLUS Waiver Program',
    description: 'Provides home and community-based services to people who are elderly or have disabilities as an alternative to nursing facility care.',
    organization: 'Texas Health and Human Services',
    category: 'healthcare',
    state: 'Texas',
    county: 'Travis County',
    phone: '1-877-782-6440',
    website: 'https://www.hhs.texas.gov/services/health/medicaid-chip/programs-services/starplus',
    eligibility: 'Must be eligible for Medicaid, age 21 or older, and meet nursing facility level of care criteria.',
    documents_needed: ['Medicaid eligibility', 'Medical assessment', 'Proof of residence'],
    tags: ['medicaid', 'waiver', 'home care', 'elderly', 'disabled']
  },
  {
    id: '6',
    title: 'California Low Income Home Energy Assistance Program (LIHEAP)',
    description: 'Provides financial assistance to help low-income households meet their home energy needs.',
    organization: 'California Department of Community Services and Development',
    category: 'financial',
    state: 'California',
    phone: '1-866-675-6623',
    website: 'https://www.csd.ca.gov/Pages/LIHEAP.aspx',
    eligibility: 'Income-based eligibility, priority given to elderly, disabled, and households with children under 5.',
    documents_needed: ['Proof of income', 'Energy bills', 'Proof of residence'],
    tags: ['utility assistance', 'energy bills', 'financial aid']
  },
  {
    id: '7',
    title: 'Area Agency on Aging of the Capital Area (AAACAP)',
    description: 'Provides services and supports for older adults and their caregivers in the Capital Area of Texas.',
    organization: 'Capital Area Council of Governments',
    category: 'community',
    state: 'Texas',
    county: 'Travis County',
    phone: '1-888-622-9111',
    website: 'https://www.capcog.org/divisions/area-agency-on-aging',
    eligibility: 'Age 60 or older, or caregivers of older adults.',
    tags: ['elderly', 'caregiving', 'community services']
  },
  {
    id: '8',
    title: 'Supplemental Security Income (SSI)',
    description: 'Federal income supplement program designed to help aged, blind, and disabled people who have little or no income.',
    organization: 'Social Security Administration',
    category: 'financial',
    state: 'California',
    phone: '1-800-772-1213',
    website: 'https://www.ssa.gov/ssi/',
    eligibility: 'Age 65 or older, blind, or disabled with limited income and resources.',
    documents_needed: ['Proof of identity', 'Proof of income and resources', 'Medical records (if applying based on disability)'],
    tags: ['disability', 'financial aid', 'federal program']
  },
  {
    id: '9',
    title: 'Medicare Savings Programs',
    description: 'Help pay for Medicare premiums, deductibles, coinsurance, and copayments for people with limited income and resources.',
    organization: 'Centers for Medicare & Medicaid Services',
    category: 'insurance',
    state: 'Texas',
    phone: '1-800-633-4227',
    website: 'https://www.medicare.gov/your-medicare-costs/get-help-paying-costs/medicare-savings-programs',
    eligibility: 'Must be eligible for Medicare Part A and meet income and resource limits.',
    documents_needed: ['Medicare card', 'Proof of income', 'Proof of resources'],
    tags: ['medicare', 'insurance', 'financial aid']
  },
  {
    id: '10',
    title: 'Senior Community Service Employment Program (SCSEP)',
    description: 'Provides part-time job training and employment opportunities for low-income adults age 55 and older.',
    organization: 'California Department of Aging',
    category: 'financial',
    state: 'California',
    county: 'Los Angeles County',
    phone: '1-916-419-7500',
    website: 'https://aging.ca.gov/Programs_and_Services/Senior_Community_Service_Employment_Program/',
    eligibility: 'Age 55 or older, unemployed, and have a family income of no more than 125% of the federal poverty level.',
    documents_needed: ['Proof of age', 'Proof of income', 'Proof of residence'],
    tags: ['employment', 'job training', 'seniors']
  },
  // New General Healthcare Resources
  {
    id: '11',
    title: 'Health Resources and Services Administration (HRSA)',
    description: 'HRSA improves health outcomes and addresses health disparities through grant funding, technical assistance, and data collection.',
    organization: 'U.S. Department of Health and Human Services',
    category: 'general_health',
    state: 'California',
    phone: '1-301-443-3376',
    website: 'https://www.hrsa.gov/',
    eligibility: 'Open to all, provides directories of health centers and programs nationwide.',
    documents_needed: ['Valid ID for services at health centers'],
    tags: ['federal health resources', 'health centers', 'community health']
  },
  {
    id: '12',
    title: 'National Institute on Aging (NIA)',
    description: 'Provides research-based information on healthy aging, age-related diseases, and health promotion for older adults.',
    organization: 'National Institutes of Health',
    category: 'general_health',
    state: 'California',
    phone: '1-800-222-2225',
    website: 'https://www.nia.nih.gov/',
    eligibility: 'Information available to all, no eligibility requirements.',
    tags: ['aging research', 'health information', 'disease prevention', 'wellness']
  },
  {
    id: '13',
    title: 'CDC Healthy Aging Program',
    description: 'Provides evidence-based resources and tools to promote healthy aging and prevent chronic diseases in older adults.',
    organization: 'Centers for Disease Control and Prevention',
    category: 'preventive_care',
    state: 'Texas',
    phone: '1-800-232-4636',
    website: 'https://www.cdc.gov/aging/',
    eligibility: 'Information and resources available to all.',
    tags: ['disease prevention', 'health promotion', 'aging', 'public health']
  },
  {
    id: '14',
    title: 'SAMHSA National Helpline',
    description: '24/7 treatment referral and information service for individuals facing mental health and substance use disorders.',
    organization: 'Substance Abuse and Mental Health Services Administration',
    category: 'mental_health',
    state: 'California',
    phone: '1-800-662-4357',
    website: 'https://www.samhsa.gov/find-help/national-helpline',
    eligibility: 'Free, confidential, 24/7 service available to all.',
    tags: ['mental health', 'substance abuse', 'crisis support', 'treatment referral']
  },
  {
    id: '15',
    title: 'Medicare Part D Extra Help Program',
    description: 'Provides assistance with Medicare prescription drug costs for people with limited income and resources.',
    organization: 'Social Security Administration',
    category: 'prescription',
    state: 'Texas',
    phone: '1-800-772-1213',
    website: 'https://www.ssa.gov/benefits/medicare/prescriptionhelp/',
    eligibility: 'Income and resource limits apply, varies by household size.',
    documents_needed: ['Medicare card', 'Proof of income', 'Bank statements', 'Investment records'],
    tags: ['prescription assistance', 'medicare', 'low-income', 'medication costs']
  },
  {
    id: '16',
    title: 'GoodRx Prescription Assistance',
    description: 'Free service that helps reduce prescription drug costs through coupons, discount cards, and pharmacy price comparison.',
    organization: 'GoodRx Holdings, Inc.',
    category: 'prescription',
    state: 'California',
    phone: '1-855-268-2822',
    website: 'https://www.goodrx.com/',
    eligibility: 'Available to all, no income restrictions.',
    tags: ['prescription discounts', 'medication savings', 'pharmacy assistance']
  },
  {
    id: '17',
    title: 'National Suicide Prevention Lifeline',
    description: '24/7 free and confidential support for people in distress, prevention and crisis resources.',
    organization: 'Substance Abuse and Mental Health Services Administration',
    category: 'emergency',
    state: 'Texas',
    phone: '988',
    website: 'https://suicidepreventionlifeline.org/',
    eligibility: 'Free service available to all.',
    tags: ['crisis support', 'suicide prevention', 'mental health emergency', '24/7 helpline']
  },
  {
    id: '18',
    title: 'NAMI Support Groups',
    description: 'National Alliance on Mental Illness provides support groups, education, and advocacy for individuals and families affected by mental illness.',
    organization: 'National Alliance on Mental Illness',
    category: 'mental_health',
    state: 'California',
    county: 'Los Angeles County',
    phone: '1-800-950-6264',
    website: 'https://www.nami.org/',
    eligibility: 'Open to all individuals and families affected by mental illness.',
    tags: ['mental health support', 'family support', 'advocacy', 'education']
  },
  {
    id: '19',
    title: 'Health Insurance Marketplace',
    description: 'Official marketplace for purchasing health insurance coverage under the Affordable Care Act.',
    organization: 'Centers for Medicare & Medicaid Services',
    category: 'insurance',
    state: 'California',
    phone: '1-800-318-2596',
    website: 'https://www.healthcare.gov/',
    eligibility: 'Open to all legal residents, income-based subsidies available.',
    documents_needed: ['Proof of income', 'Tax returns', 'Social Security Number', 'Immigration documents (if applicable)'],
    tags: ['health insurance', 'affordable care act', 'subsidies', 'coverage']
  },
  {
    id: '20',
    title: 'State Health Insurance Assistance Program (SHIP)',
    description: 'Free counseling and assistance with Medicare, Medicare Supplement Insurance, and other health insurance options.',
    organization: 'Administration for Community Living',
    category: 'insurance',
    state: 'Texas',
    phone: '1-877-839-2675',
    website: 'https://www.shiphelp.org/',
    eligibility: 'Available to all Medicare beneficiaries and their families.',
    tags: ['medicare counseling', 'insurance assistance', 'free counseling', 'seniors']
  },
  {
    id: '21',
    title: 'Veterans Health Administration',
    description: 'Comprehensive healthcare services for eligible veterans including medical, dental, mental health, and specialty care.',
    organization: 'U.S. Department of Veterans Affairs',
    category: 'general_health',
    state: 'California',
    county: 'San Diego County',
    phone: '1-877-222-8387',
    website: 'https://www.va.gov/health/',
    eligibility: 'Must be a veteran with qualifying military service.',
    documents_needed: ['DD-214 discharge papers', 'Military service records', 'Income information'],
    tags: ['veterans health', 'military service', 'comprehensive care', 'federal benefits']
  },
  {
    id: '22',
    title: 'Poison Control Center',
    description: '24/7 emergency service providing immediate assistance for poison emergencies and toxic exposures.',
    organization: 'American Association of Poison Control Centers',
    category: 'emergency',
    state: 'Texas',
    phone: '1-800-222-1222',
    website: 'https://www.poison.org/',
    eligibility: 'Free emergency service available to all.',
    tags: ['poison emergency', 'toxic exposure', '24/7 emergency', 'immediate assistance']
  },
  {
    id: '23',
    title: 'Eldercare Locator',
    description: 'National public service connecting older adults and their caregivers with trustworthy local support resources.',
    organization: 'Administration for Community Living',
    category: 'general_health',
    state: 'California',
    county: 'Santa Clara County',
    phone: '1-800-677-1116',
    website: 'https://eldercare.acl.gov/',
    eligibility: 'Available to all older adults and their caregivers.',
    tags: ['eldercare', 'local resources', 'caregiver support', 'aging services']
  },
  {
    id: '24',
    title: 'National Cancer Institute Cancer Information Service',
    description: 'Provides accurate, up-to-date cancer information and support for patients, families, and healthcare professionals.',
    organization: 'National Cancer Institute',
    category: 'general_health',
    state: 'Texas',
    phone: '1-800-422-6237',
    website: 'https://www.cancer.gov/',
    eligibility: 'Information and support available to all.',
    tags: ['cancer information', 'patient support', 'treatment options', 'research']
  },
  {
    id: '25',
    title: 'RxAssist Patient Assistance Programs',
    description: 'Comprehensive database of patient assistance programs offered by pharmaceutical companies to help with medication costs.',
    organization: 'RxAssist',
    category: 'prescription',
    state: 'California',
    phone: '1-401-729-3284',
    website: 'https://www.rxassist.org/',
    eligibility: 'Varies by program, generally income-based qualification.',
    documents_needed: ['Prescription information', 'Income verification', 'Insurance information'],
    tags: ['patient assistance', 'pharmaceutical programs', 'medication discounts', 'prescription help']
  }
];

const Resources: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const { toast } = useToast();

  // Fetch resources from database
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from the database
        // const { data, error } = await supabase
        //   .from('resources')
        //   .select('*');
        
        // if (error) throw error;
        // setResources(data || []);
        
        // For now, use mock data
        setTimeout(() => {
          setResources(mockResources);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast({
          title: 'Error',
          description: 'Failed to load resources',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [toast]);

  // Filter resources based on search query, state, county, and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesState = selectedState === 'all' || resource.state === selectedState;
    const matchesCounty = selectedCounty === 'all' || resource.county === selectedCounty;
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesState && matchesCounty && matchesCategory;
  });

  // Get category name from ID
  const getCategoryName = (categoryId: string): string => {
    const category = resourceCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Senior & Family Resources
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Access valuable information about state and local agencies, financial assistance programs, insurance options, and more to support seniors and their families.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedState} onValueChange={(value) => {
                setSelectedState(value);
                setSelectedCounty('all'); // Reset county when state changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="Texas">Texas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedCounty} 
                onValueChange={setSelectedCounty}
                disabled={selectedState === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedState === 'all' ? "Select State First" : "Select County"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  {selectedState !== 'all' && statesAndCounties[selectedState as keyof typeof statesAndCounties]?.map(county => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Resource Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {resourceCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resources Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Resources List */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Resources</h2>
                  <p className="text-sm text-gray-500">
                    {filteredResources.length} resources found
                  </p>
                </div>
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                      <div 
                        key={resource.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedResource?.id === resource.id ? 'bg-gray-50' : ''}`}
                        onClick={() => setSelectedResource(resource)}
                      >
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{resource.organization}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline">{resource.state}</Badge>
                          {resource.county && (
                            <Badge variant="outline">{resource.county}</Badge>
                          )}
                          <Badge variant="secondary">{getCategoryName(resource.category)}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No resources found matching your criteria.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedState('all');
                          setSelectedCounty('all');
                          setSelectedCategory('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Resource Details */}
            <div className="md:col-span-2">
              {selectedResource ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedResource.title}</CardTitle>
                        <CardDescription>{selectedResource.organization}</CardDescription>
                      </div>
                      <Badge>{getCategoryName(selectedResource.category)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-gray-700">{selectedResource.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{selectedResource.state}{selectedResource.county ? `, ${selectedResource.county}` : ''}</span>
                        </div>
                      </div>
                      
                      {selectedResource.phone && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{selectedResource.phone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {selectedResource.website && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Website</h3>
                        <div className="flex items-center mt-1">
                          <Globe className="h-4 w-4 text-gray-500 mr-2" />
                          <a 
                            href={selectedResource.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            {selectedResource.website}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedResource.eligibility && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Eligibility</h3>
                        <p className="text-gray-700">{selectedResource.eligibility}</p>
                      </div>
                    )}
                    
                    {selectedResource.documents_needed && selectedResource.documents_needed.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Required Documents</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedResource.documents_needed.map((doc, index) => (
                            <li key={index} className="text-gray-700">{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedResource.tags && selectedResource.tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedResource.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Info
                    </Button>
                    
                    {selectedResource.website && (
                      <Button>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Info className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Resource</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Choose a resource from the list to view detailed information about programs, eligibility, and how to apply.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* Additional Information */}
              <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">How to Use These Resources</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 rounded-full p-2 mt-1">
                      <HelpCircle className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">Contact Directly</p>
                      <p className="text-sm text-gray-600">Reach out to the organization using the provided contact information to inquire about eligibility and application processes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 rounded-full p-2 mt-1">
                      <FileText className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">Prepare Documentation</p>
                      <p className="text-sm text-gray-600">Gather the required documents before applying to streamline the process.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 rounded-full p-2 mt-1">
                      <Phone className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">Ask for Assistance</p>
                      <p className="text-sm text-gray-600">Our concierge team is available to help you navigate these resources. <a href="/contact" className="text-indigo-600 hover:underline">Contact us</a> for personalized support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Federal Resources */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Federal Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medicare</CardTitle>
                  <CardDescription>Federal health insurance program</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Medicare is the federal health insurance program for people who are 65 or older, certain younger people with disabilities, and people with End-Stage Renal Disease.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                      <a 
                        href="https://www.medicare.gov/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        medicare.gov
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>1-800-MEDICARE (1-800-633-4227)</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Social Security Administration</CardTitle>
                  <CardDescription>Retirement, disability, and survivor benefits</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    The Social Security Administration provides financial benefits to eligible retirees, disabled individuals, and their families.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                      <a 
                        href="https://www.ssa.gov/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        ssa.gov
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>1-800-772-1213</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Administration for Community Living</CardTitle>
                  <CardDescription>Federal agency supporting older adults and people with disabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    The Administration for Community Living works to ensure that older adults and people with disabilities can live independently and participate fully in their communities.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                      <a 
                        href="https://acl.gov/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        acl.gov
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>1-202-401-4634</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Resource Guides */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Resource Guides</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Assistance Guide</CardTitle>
                  <CardDescription>Comprehensive guide to financial resources for seniors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    This guide provides detailed information about financial assistance programs available to seniors, including Social Security, Supplemental Security Income (SSI), and state-specific programs.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Guide (PDF)
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Medicare & Insurance Guide</CardTitle>
                  <CardDescription>Understanding healthcare coverage options</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Navigate the complex world of Medicare, Medicaid, and supplemental insurance options with this comprehensive guide designed specifically for seniors and their families.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Guide (PDF)
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Housing Support Guide</CardTitle>
                  <CardDescription>Housing options and assistance programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Explore housing options for seniors, including aging in place, assisted living, and nursing homes, along with financial assistance programs to help cover housing costs.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Guide (PDF)
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Caregiver Resources Guide</CardTitle>
                  <CardDescription>Support for family caregivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    This guide provides information about resources and support services available to family caregivers, including respite care, support groups, and financial assistance.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Guide (PDF)
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Need Help Section */}
          <div className="mt-16 bg-indigo-50 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Navigating Resources?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Our concierge team can help you identify the right resources for your specific situation and guide you through the application process.
              </p>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;