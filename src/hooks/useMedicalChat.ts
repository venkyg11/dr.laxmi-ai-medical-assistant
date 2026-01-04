import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isEmergency?: boolean;
  suggestions?: {
    medications?: string[];
    dos?: string[];
    donts?: string[];
  };
}

interface UseMedicalChatOptions {
  onResponse?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export function useMedicalChat({ onResponse, onError }: UseMedicalChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;
    
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("medical-chat", {
        body: { 
          message: userMessage,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        },
      });
      
      if (error) throw error;
      
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        isEmergency: data.isEmergency,
        suggestions: data.suggestions,
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      onResponse?.(assistantMsg);
      
      return assistantMsg;
    } catch (error) {
      console.error("Medical chat error:", error);
      onError?.(error instanceof Error ? error : new Error("Failed to get response"));
      
      // Add error message
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, onResponse, onError]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
