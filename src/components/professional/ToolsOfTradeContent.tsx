
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calculator, FileText, CreditCard, Link, PiggyBank, Wallet } from 'lucide-react';

const ToolsOfTradeContent = () => {
  return (
    <Tabs defaultValue="financing">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="financing">Financing & Funding</TabsTrigger>
        <TabsTrigger value="licensing">Licensing & Compliance</TabsTrigger>
        <TabsTrigger value="resources">Practice Resources</TabsTrigger>
      </TabsList>
      
      {/* Financing & Funding Tab */}
      <TabsContent value="financing" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <PiggyBank className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Research Grants</CardTitle>
                </div>
                <Badge variant="outline">Funding</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Access competitive research grants specifically for healthcare practitioners and research institutions.
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Medical Research Council - Up to $250,000 for clinical studies</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Healthcare Innovation Fund - $50,000-$100,000 for novel approaches</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Emerging Therapies Grant - Focused on experimental treatments</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Browse All Grants</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Equipment Financing</CardTitle>
                </div>
                <Badge variant="outline">Financing</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Special rates and flexible payment plans for medical equipment and technology.
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>HealthTech Partners - 0% interest for 12 months on new equipment</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Medical Capital Solutions - Leasing options with buyout flexibility</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>PracticeGrow Financing - Tailored loans for practice expansion</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply for Financing</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Patient Funding Solutions</CardTitle>
                </div>
                <Badge variant="outline">Patient Support</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Financial assistance programs to help your patients afford necessary care.
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>CareCredit Partnership - Special healthcare financing for patients</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>PatientPay Solutions - Flexible payment plans without credit checks</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Hardship Fund Connections - For patients facing financial difficulties</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Provide to Patients</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Tax Incentives</CardTitle>
                </div>
                <Badge variant="outline">Financial Planning</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Maximize tax benefits specifically available to medical practitioners.
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Research & Development Tax Credits for medical innovation</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Section 179 Deduction for medical equipment purchases</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Retirement planning options for healthcare professionals</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Schedule Consultation</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      
      {/* Licensing & Compliance Tab */}
      <TabsContent value="licensing" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Licensing Assistance</CardTitle>
                </div>
                <Badge variant="outline">Compliance</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Services to help you obtain and maintain your medical licenses.
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>MedLicense Partners - Streamlined license application support</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Multi-State Licensing Services - Expand your practice across states</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Renewal Management - Never miss a licensing deadline</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get License Support</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Link className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Continuing Education</CardTitle>
                </div>
                <Badge variant="outline">Education</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Access required and advanced continuing education credits with exclusive discounts.
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>MedEd Online - 30% discount on all CE courses</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Healthcare Conference Network - Special rates on events</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Specialty Training Courses - Advanced practice certifications</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Browse CE Offerings</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      
      {/* Practice Resources Tab */}
      <TabsContent value="resources" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Practice Setup</CardTitle>
                </div>
                <Badge variant="outline">Resources</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Resources for establishing or relocating your medical practice.
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Location Analysis - Find optimal areas for your specialty</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Practice Design Services - Efficient clinical workspace planning</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Business Structure Consultants - Optimized legal setup</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Explore Setup Services</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Link className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Affiliate Network</CardTitle>
                </div>
                <Badge>Featured</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Connect with complementary services and earn referral incentives.
              </CardDescription>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Specialty Labs - Partner discounts and referral bonuses</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Medical Supply Partnerships - Wholesale pricing for your practice</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Digital Health Integrations - Expand your service offerings</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Join Affiliate Network</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ToolsOfTradeContent;
