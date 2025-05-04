
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Send, ThermometerSun, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAccessCheck } from '@/hooks/useToolAccess';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  title?: string;
  description?: string;
  contextType?: 'general' | 'appointment' | 'symptom' | 'health_tool';
  isFloating?: boolean;
  initialMessage?: string;
  onAction?: (action: string, data: any) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  title = "AI Health Assistant",
  description = "I'm here to help with your health needs",
  contextType = 'general',
  isFloating = false,
  initialMessage = "Hello! How can I help you with your healthcare needs today?",
  onAction
}) => {
  const [isVisible, setIsVisible] = useState(!isFloating);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, membershipTier } = useAuth();
  const { hasAccess } = useAccessCheck(user?.id || null, 'ai_assistant');
  
  // Initialize with system message
  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Store user message in Supabase
      if (user) {
        await supabase.from('tool_submissions').insert({
          user_id: user.id,
          tool_name: 'ai_assistant',
          submission_data: {
            context_type: contextType,
            message: input,
            membership_tier: membershipTier
          }
        });
      }

      // For demo purposes, simulate AI response with contextual awareness
      setTimeout(() => {
        let aiResponse = "";
        
        // Generate contextual response based on the type and message content
        if (contextType === 'symptom' && 
            (input.toLowerCase().includes('headache') || 
             input.toLowerCase().includes('pain'))) {
          aiResponse = "I notice you're experiencing discomfort. Let me help assess your symptoms. How severe is your pain on a scale of 1-10, and how long have you been experiencing it?";
          
          // Notify parent component of potential action
          onAction && onAction('symptom_detected', { symptom: 'headache', severity: 'unknown' });
        } 
        else if (contextType === 'appointment' && 
                (input.toLowerCase().includes('schedule') || 
                 input.toLowerCase().includes('book') || 
                 input.toLowerCase().includes('appointment'))) {
          aiResponse = `As a ${membershipTier || 'smart'} member, you can schedule appointments with our network providers. Would you like me to help you find available slots this week?`;
          
          // Notify parent component of potential action
          onAction && onAction('appointment_intent', { requested: new Date() });
        }
        else if (input.toLowerCase().includes('medication') || input.toLowerCase().includes('prescription')) {
          aiResponse = "I see you're asking about medications. Would you like me to help you set up a refill request or check on your current prescriptions?";
          
          // Notify parent component of potential action
          onAction && onAction('medication_inquiry', { type: 'general' });
        }
        else {
          aiResponse = "I understand you're asking for assistance. How else may I help with your healthcare needs today?";
        }

        const assistantMessage = {
          role: 'assistant' as const,
          content: aiResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const toggleVoiceRecognition = () => {
    // Voice recognition functionality would be implemented here
    // For this demo, we'll just toggle the state
    setIsListening(prev => !prev);
    
    if (!isListening) {
      toast({
        title: "Voice Recognition",
        description: "Voice recognition feature would activate here.",
      });
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!hasAccess) {
    return null;
  }

  if (isFloating && !isVisible) {
    return (
      <Button
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsVisible(true)}
      >
        <ThermometerSun className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={isFloating ? "fixed bottom-6 right-6 w-[350px] h-[500px] z-50 shadow-xl flex flex-col" : "h-[500px] flex flex-col"}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThermometerSun className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {isFloating && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary/10 text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-2">
        <div className="flex w-full items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className={isListening ? "text-destructive" : ""}
            onClick={toggleVoiceRecognition}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Textarea
            placeholder="Type your message..."
            className="min-h-[40px] flex-1 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button size="icon" disabled={!input.trim() || isLoading} onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="w-full text-center text-xs text-muted-foreground mt-1">
          Assistant responses are AI-generated. Always consult a healthcare professional for medical advice.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
