
import React, { createContext, useState, useContext } from 'react';
import { ChatMessage } from '@/types';
import { toast } from 'sonner';

interface ChatContextType {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to AYUSH Virtual Herbal Garden! How can I assist you with medicinal herbs today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Gemini API key
  const GEMINI_API_KEY = "AIzaSyASkyEiWCjOXiMMXRySnRBOtVcwegvHWe4";
  const GEMINI_MODEL = "gemini-2.0-flash";

  const sendMessage = async (content: string) => {
    try {
      setLoading(true);
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Prepare message history for Gemini
      const messageHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add the new user message
      messageHistory.push({
        role: userMessage.role,
        content: userMessage.content
      });
      
      // Call Gemini API
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are a medicinal herbs expert specializing in Ayurvedic, traditional, and modern herbal remedies. 
                    Your name is AYUSH Herbal Assistant. 
                    Answer the following question about medicinal herbs, their uses, benefits, and traditional knowledge: ${content}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024
            }
          })
        });

        const data = await response.json();
        console.log("Gemini API response:", data);
        
        let botResponse = "I'm sorry, I couldn't process your request at this moment.";
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          botResponse = data.candidates[0].content.parts[0].text;
        } else if (data.promptFeedback && data.promptFeedback.blockReason) {
          botResponse = `I'm unable to respond to that query due to content restrictions (${data.promptFeedback.blockReason}).`;
        }
        
        // Add bot response
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: botResponse,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
      } catch (error) {
        console.error('Gemini API error:', error);
        
        // Fallback to predefined responses if API fails
        let botResponse = "I'm having trouble connecting to my knowledge base. Please try again later.";
        
        // Simple fallback based on keywords
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('tulsi') || lowerContent.includes('holy basil')) {
          botResponse = "Tulsi (Holy Basil) is one of the most sacred herbs in India. It has adaptogenic properties that help the body adapt to stress, and it's commonly used for respiratory conditions, fever, and anxiety. The leaves contain essential oils like eugenol, which has antiseptic properties.";
        } else if (lowerContent.includes('ashwagandha')) {
          botResponse = "Ashwagandha is often referred to as 'Indian Ginseng' and is one of the most important herbs in Ayurvedic medicine. It helps reduce anxiety and stress, improves concentration, and increases energy levels. It's classified as an adaptogen, helping the body resist physiological and psychological stress.";
        }
        
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: botResponse,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        toast.error('Failed to get response from assistant');
      }
      
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'system-1',
        role: 'system',
        content: 'Welcome to AYUSH Virtual Herbal Garden! How can I assist you with medicinal herbs today?',
        timestamp: new Date().toISOString()
      }
    ]);
    toast.info('Chat cleared');
  };

  const value = {
    messages,
    loading,
    sendMessage,
    clearChat
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
