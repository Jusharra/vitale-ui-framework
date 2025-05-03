
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, CircleCheck, Clock, Search, MessageSquare, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from '@/components/ui/separator';

// Mock data
const conversations = [
  {
    id: 1,
    provider: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    avatar: "/placeholder.svg",
    lastMessage: "Your test results look good. Let's discuss at your next appointment.",
    time: "Today, 9:30 AM",
    unread: true,
  },
  {
    id: 2,
    provider: "Dr. Michael Chen",
    specialty: "Primary Care",
    avatar: "/placeholder.svg",
    lastMessage: "Remember to take your medication as prescribed. Let me know if you have any questions.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    provider: "Dr. Emily Rodriguez",
    specialty: "Dermatology",
    avatar: "/placeholder.svg",
    lastMessage: "The rash should clear up in a few days. Please send a photo if it gets worse.",
    time: "May 1, 2025",
    unread: false,
  }
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");

  const handleSend = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  return (
    <MemberPageLayout 
      title="Messages" 
      description="Securely communicate with your healthcare providers"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
        {/* Conversations sidebar */}
        <Card className="md:col-span-1 h-full overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Conversations</CardTitle>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="flex flex-col">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${selectedConversation.id === conversation.id ? 'bg-muted' : ''}`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{conversation.provider}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {conversation.unread ? (
                          <Badge className="h-2 w-2 p-0 rounded-full bg-primary" />
                        ) : null}
                        <p className="text-sm truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Chat area */}
        <Card className="md:col-span-2 h-full overflow-hidden flex flex-col">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedConversation.provider}</h3>
                  <p className="text-sm text-muted-foreground">{selectedConversation.specialty}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-auto bg-muted/30">
            <div className="flex flex-col gap-4">
              {/* Provider message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="bg-background rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">{selectedConversation.lastMessage}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{selectedConversation.time}</span>
                  </div>
                </div>
              </div>
              
              {/* Info message */}
              <div className="flex justify-center">
                <div className="bg-muted px-3 py-1 rounded text-xs text-center text-muted-foreground">
                  Please note that messages are typically responded to within 24 hours
                </div>
              </div>
              
              {/* This would be populated with actual messages in a real app */}
              <div className="flex-1"></div>
            </div>
          </CardContent>
          <div className="p-4 border-t">
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
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-muted-foreground">
                <CircleCheck className="h-3 w-3 inline mr-1" />
                HIPAA compliant messaging
              </div>
              <div className="text-xs text-muted-foreground">
                <Clock className="h-3 w-3 inline mr-1" />
                Messages typically responded to within 24 hours
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MemberPageLayout>
  );
};

export default Messages;
