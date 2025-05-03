
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Users, AlertCircle, Bell, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock data for messages
const memberMessages = [
  { 
    id: 1, 
    sender: "Thomas Lee", 
    avatar: "TL", 
    subject: "Prescription Refill Question", 
    preview: "Hello Dr. Wilson, I was wondering if I could get a refill on my prescription for...", 
    time: "10:30 AM", 
    date: "Today", 
    unread: true 
  },
  { 
    id: 2, 
    sender: "Jessica Miller", 
    avatar: "JM", 
    subject: "Follow-up Appointment", 
    preview: "I wanted to schedule a follow-up appointment for next week to discuss the results of my...", 
    time: "Yesterday", 
    date: "May 2", 
    unread: false 
  },
  { 
    id: 3, 
    sender: "Robert Smith", 
    avatar: "RS", 
    subject: "Lab Results Concerns", 
    preview: "I received my lab results through the portal and I have some concerns about my cholesterol levels...", 
    time: "2 days ago", 
    date: "May 1", 
    unread: false 
  }
];

const adminMessages = [
  { 
    id: 1, 
    sender: "Admin Team", 
    avatar: "AT", 
    subject: "New Telehealth Protocol", 
    preview: "We are updating our telehealth protocols effective June 1st. Please review the attached...", 
    time: "05:45 PM", 
    date: "Today", 
    unread: true,
    isAdmin: true
  },
  { 
    id: 2, 
    sender: "System Administrator", 
    avatar: "SA", 
    subject: "Maintenance Notice", 
    preview: "The patient portal will be down for scheduled maintenance on Sunday, May 5th from 2am to 4am EST...", 
    time: "Yesterday", 
    date: "May 2", 
    unread: false,
    isAdmin: true
  }
];

// Mock announcements
const announcements = [
  {
    id: 1,
    title: "Updated COVID-19 Guidelines",
    content: "Please review the updated COVID-19 protocols for in-person visits, effective immediately.",
    date: "May 2, 2025",
    priority: "high"
  },
  {
    id: 2,
    title: "Annual Provider Conference",
    content: "Registration is now open for the annual provider conference scheduled for August 15-17 in San Francisco.",
    date: "April 28, 2025",
    priority: "medium"
  },
  {
    id: 3,
    title: "New Electronic Health Record System",
    content: "Training sessions for the new EHR system will begin next month. Please sign up for a slot.",
    date: "April 25, 2025",
    priority: "high"
  }
];

// Types for the message state
type Message = {
  id: number;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  time: string;
  date: string;
  unread: boolean;
  isAdmin?: boolean;
  content?: string;
};

const MessageCenterContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composeData, setComposeData] = useState({
    recipient: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  // Function to handle message selection
  const handleMessageSelect = (message: Message) => {
    setSelectedMessage({
      ...message,
      unread: false,
      content: "This is a mock message content. In a real application, this would contain the full message body. The message would be marked as read once opened.\n\nThank you for using our healthcare platform.\n\nBest regards,\n" + message.sender
    });
    
    // Mark message as read in the list (just for UI)
    if (activeTab === "inbox") {
      memberMessages.find(m => m.id === message.id)!.unread = false;
    } else if (activeTab === "admin") {
      adminMessages.find(m => m.id === message.id)!.unread = false;
    }
  };

  // Function to handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!composeData.recipient.trim() || !composeData.subject.trim() || !composeData.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to send your message.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send the message to an API
    toast({
      title: "Message sent",
      description: `Your message to ${composeData.recipient} has been sent.`,
    });
    
    // Reset the form
    setComposeData({
      recipient: "",
      subject: "",
      message: ""
    });
    
    // Switch to inbox
    setActiveTab("inbox");
  };

  // Filter messages based on search query
  const filteredMemberMessages = memberMessages.filter(
    message => 
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAdminMessages = adminMessages.filter(
    message => 
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAnnouncements = announcements.filter(
    announcement => 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => { setActiveTab("compose"); setSelectedMessage(null); }}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Compose New
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="inbox" className="flex gap-1 items-center">
            <MessageSquare className="h-4 w-4" />
            <span>Member Messages</span>
            {memberMessages.some(m => m.unread) && (
              <Badge variant="default" className="h-5 min-w-5 ml-1 rounded-full px-1.5">
                {memberMessages.filter(m => m.unread).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex gap-1 items-center">
            <Users className="h-4 w-4" />
            <span>Admin Messages</span>
            {adminMessages.some(m => m.unread) && (
              <Badge variant="default" className="h-5 min-w-5 ml-1 rounded-full px-1.5">
                {adminMessages.filter(m => m.unread).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex gap-1 items-center">
            <Bell className="h-4 w-4" />
            <span>Announcements</span>
          </TabsTrigger>
          <TabsTrigger value="compose" className="flex gap-1 items-center">
            <Send className="h-4 w-4" />
            <span>Compose</span>
          </TabsTrigger>
        </TabsList>

        {/* Member Messages Tab */}
        <TabsContent value="inbox" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Message List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Messages from Members</CardTitle>
                <CardDescription>
                  {filteredMemberMessages.length} messages in your inbox
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredMemberMessages.length > 0 ? (
                    filteredMemberMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-muted flex gap-3 ${
                          selectedMessage?.id === message.id ? 'bg-muted/50' : ''
                        } ${message.unread ? 'bg-muted/20' : ''}`}
                        onClick={() => handleMessageSelect(message)}
                      >
                        <Avatar className="h-10 w-10 mt-1">
                          <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-sm font-semibold">
                            {message.avatar}
                          </div>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${message.unread ? 'text-primary' : ''}`}>
                              {message.sender}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.time}
                            </span>
                          </div>
                          <span className="text-sm font-medium truncate">
                            {message.subject}
                          </span>
                          <p className="text-sm text-muted-foreground truncate">
                            {message.preview}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-muted-foreground">
                              {message.date}
                            </span>
                            {message.unread && (
                              <Badge variant="default" className="h-5 text-xs">New</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      No messages found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Viewer */}
            <Card className="md:col-span-2">
              {selectedMessage ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedMessage.subject}</CardTitle>
                        <CardDescription>
                          From: {selectedMessage.sender} • {selectedMessage.date} at {selectedMessage.time}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { setActiveTab("compose"); setComposeData(c => ({...c, recipient: selectedMessage.sender})) }}
                      >
                        Reply
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{selectedMessage.content}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                      Back to Inbox
                    </Button>
                    <div>
                      <Button variant="ghost" size="sm" className="mr-2">
                        Archive
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">No message selected</h3>
                  <p>Select a message from the list to view its contents</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Admin Messages Tab */}
        <TabsContent value="admin" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Message List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Messages from Admin</CardTitle>
                <CardDescription>
                  {filteredAdminMessages.length} messages from administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredAdminMessages.length > 0 ? (
                    filteredAdminMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-muted flex gap-3 ${
                          selectedMessage?.id === message.id ? 'bg-muted/50' : ''
                        } ${message.unread ? 'bg-muted/20' : ''}`}
                        onClick={() => handleMessageSelect(message)}
                      >
                        <Avatar className="h-10 w-10 mt-1 bg-secondary">
                          <div className="bg-secondary text-secondary-foreground w-full h-full flex items-center justify-center text-sm font-semibold">
                            {message.avatar}
                          </div>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${message.unread ? 'text-primary' : ''}`}>
                              {message.sender}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.time}
                            </span>
                          </div>
                          <span className="text-sm font-medium truncate">
                            {message.subject}
                          </span>
                          <p className="text-sm text-muted-foreground truncate">
                            {message.preview}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-muted-foreground">
                              {message.date}
                            </span>
                            {message.unread && (
                              <Badge variant="default" className="h-5 text-xs">New</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      No admin messages found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Viewer */}
            <Card className="md:col-span-2">
              {selectedMessage ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedMessage.subject}</CardTitle>
                        <CardDescription>
                          From: {selectedMessage.sender} • {selectedMessage.date} at {selectedMessage.time}
                        </CardDescription>
                      </div>
                      {selectedMessage.isAdmin && (
                        <Badge variant="outline" className="bg-secondary/10">
                          Administrative Message
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{selectedMessage.content}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                      Back to Inbox
                    </Button>
                    <div>
                      <Button variant="ghost" size="sm" className="mr-2">
                        Mark as Important
                      </Button>
                      <Button variant="ghost" size="sm">
                        Archive
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">No message selected</h3>
                  <p>Select a message from the list to view its contents</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="mt-6">
          <div className="space-y-6">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{announcement.title}</CardTitle>
                      {announcement.priority === "high" && (
                        <Badge variant="destructive" className="uppercase">High Priority</Badge>
                      )}
                      {announcement.priority === "medium" && (
                        <Badge variant="secondary" className="uppercase">Medium Priority</Badge>
                      )}
                    </div>
                    <CardDescription>{announcement.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{announcement.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/10 rounded-lg">
                <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No announcements found</h3>
                <p>There are no current announcements matching your search</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Compose Tab */}
        <TabsContent value="compose" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compose New Message</CardTitle>
              <CardDescription>Send a message to a member or administrator</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="recipient" className="text-sm font-medium">
                    To:
                  </label>
                  <Input 
                    id="recipient"
                    value={composeData.recipient}
                    onChange={(e) => setComposeData({...composeData, recipient: e.target.value})}
                    placeholder="Enter recipient name or select from list"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject:
                  </label>
                  <Input 
                    id="subject"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                    placeholder="Enter message subject"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message:
                  </label>
                  <Textarea 
                    id="message"
                    value={composeData.message}
                    onChange={(e) => setComposeData({...composeData, message: e.target.value})}
                    placeholder="Type your message here..."
                    className="min-h-[200px]"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveTab("inbox");
                  setComposeData({
                    recipient: "",
                    subject: "",
                    message: ""
                  });
                }}
              >
                Cancel
              </Button>
              <div>
                <Button variant="outline" className="mr-2">Save Draft</Button>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessageCenterContent;
