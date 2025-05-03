
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, HelpCircle, CircleCheck, ThermometerSun } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock FAQ data
const faqData = [
  {
    category: "General",
    questions: [
      {
        id: 1,
        question: "What is Vitale Health Concierge?",
        answer: "Vitale Health Concierge is a medical concierge platform that offers tiered membership plans to provide members with enhanced access to healthcare services, digital health tools, and personalized concierge support."
      },
      {
        id: 2,
        question: "How do I upgrade my membership?",
        answer: "You can upgrade your membership by navigating to the Membership page in your dashboard. There you'll find options to compare plans and upgrade to a higher tier. Changes take effect immediately upon successful payment."
      },
      {
        id: 3,
        question: "Is there a mobile app available?",
        answer: "Yes, the Vitale Health Concierge mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store. The app provides all the same functionality as the web platform."
      }
    ]
  },
  {
    category: "Appointments",
    questions: [
      {
        id: 4,
        question: "How do I schedule an appointment?",
        answer: "You can schedule appointments through your dashboard by clicking on the 'Book Appointment' button in the Appointments section. You'll be able to select your preferred provider, date, time, and reason for visit."
      },
      {
        id: 5,
        question: "What's the cancellation policy?",
        answer: "Appointments can be cancelled or rescheduled up to 24 hours before the scheduled time without penalty. Cancellations with less than 24 hours notice may incur a fee depending on your membership tier."
      }
    ]
  },
  {
    category: "Billing",
    questions: [
      {
        id: 6,
        question: "How is my membership billed?",
        answer: "Memberships are billed on a monthly or annual basis, depending on the option you select. We accept all major credit cards and some HSA/FSA cards for payment."
      },
      {
        id: 7,
        question: "Is there a refund policy?",
        answer: "We offer a 30-day satisfaction guarantee for new members. If you're not satisfied with our service within the first 30 days, you can request a refund. After this period, refunds are considered on a case-by-case basis."
      }
    ]
  }
];

const Support = () => {
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);

  // Filter FAQs based on search
  const filteredFaqs = searchQuery.trim() === "" 
    ? faqData 
    : faqData.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0);

  const handleSend = () => {
    if (messageText.trim()) {
      console.log("Sending message to AI assistant:", messageText);
      setMessageText("");
      // In a real app, this would send the message to the AI and display a response
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", { name, email, subject, message });
    // Reset form in this demo
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    // Show confirmation in a real app
  };

  return (
    <MemberPageLayout 
      title="Support" 
      description="Get help with your account and services"
    >
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>
        
        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search FAQs..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {filteredFaqs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No FAQ matches found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term or check our other support options
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.questions.map((faq) => (
                      <div key={faq.id} className="space-y-2 last:pb-0">
                        <div className="flex gap-2">
                          <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                          <h3 className="font-medium">{faq.question}</h3>
                        </div>
                        <p className="text-muted-foreground ml-7">{faq.answer}</p>
                        {faq.id !== category.questions[category.questions.length - 1].id && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
            
            <div className="bg-muted rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help you with any questions you may have
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => document.querySelector('[data-value="contact"]')?.click()}
                >
                  Contact Support Team
                </Button>
                <Button
                  onClick={() => document.querySelector('[data-value="ai-assistant"]')?.click()}
                >
                  Chat with AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Contact Us Tab */}
        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>Send us a message and we'll respond within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Name</label>
                          <Input 
                            id="name"
                            placeholder="Your name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <Input 
                            id="email"
                            type="email" 
                            placeholder="your.email@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                        <Input 
                          id="subject"
                          placeholder="Subject of your inquiry" 
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                        <Textarea 
                          id="message"
                          placeholder="Please describe your issue or question in detail..." 
                          className="min-h-[150px]"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CircleCheck className="h-4 w-4 text-primary" />
                        <span>Your message will be encrypted and handled securely</span>
                      </div>
                      <Button type="submit" className="mt-2">Send Message</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Methods</CardTitle>
                  <CardDescription>Other ways to reach our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium">Phone Support</p>
                    <p className="text-muted-foreground">1-800-VITALE</p>
                    <p className="text-sm text-muted-foreground">
                      Available Monday-Friday, 8AM-8PM EST
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium">Email Support</p>
                    <p className="text-muted-foreground">support@vitalehealth.com</p>
                    <p className="text-sm text-muted-foreground">
                      Response within 24 hours
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => document.querySelector('[data-value="ai-assistant"]')?.click()}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with AI Assistant
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Member Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <CircleCheck className="h-5 w-5 text-primary" />
                    <p>User Guides</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <CircleCheck className="h-5 w-5 text-primary" />
                    <p>Video Tutorials</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <CircleCheck className="h-5 w-5 text-primary" />
                    <p>Common Issues</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <CircleCheck className="h-5 w-5 text-primary" />
                    <p>Terms of Service</p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <CircleCheck className="h-5 w-5 text-primary" />
                    <p>Privacy Policy</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* AI Assistant Tab */}
        <TabsContent value="ai-assistant" className="mt-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ThermometerSun className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Health Assistant</CardTitle>
                  <CardDescription>AI-powered support for your health questions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                  <p className="font-medium">Welcome to Vitale Health Assistant</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    I'm here to help answer your health questions and guide you through our services. How can I assist you today?
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-primary/10 rounded-lg p-4 max-w-[80%]">
                    <p className="font-medium">How do I schedule an appointment?</p>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                  <p className="font-medium">Scheduling an appointment is easy</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You can schedule an appointment by going to the "Appointments" section in your dashboard and clicking on the "Book Appointment" button. From there, you can select your preferred provider, date, and time.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Would you like me to guide you through the process step by step?
                  </p>
                </div>
                
                {/* This would be populated with actual conversation in a real app */}
                <div className="flex-1"></div>
              </div>
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Type your message..." 
                  className="min-h-[60px] resize-none"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button onClick={handleSend} className="shrink-0 self-end">
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                While our AI can provide general guidance, please contact a healthcare professional for medical advice.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {!aiAssistantVisible && (
        <div className="fixed bottom-6 right-6">
          <Button 
            className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
            onClick={() => {
              document.querySelector('[data-value="ai-assistant"]')?.click();
              setAiAssistantVisible(true);
            }}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      )}
    </MemberPageLayout>
  );
};

export default Support;
