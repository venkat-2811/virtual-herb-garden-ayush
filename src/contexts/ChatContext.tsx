
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
      
      // Call Gemini API (mocked for now)
      try {
        // This would be a real API call in production
        // For development, we'll simulate a response
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let botResponse = "I'm sorry, I couldn't process your request at this moment.";
        
        // Simulate responses based on keywords in the user's message
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('tulsi') || lowerContent.includes('holy basil')) {
          botResponse = "Tulsi (Holy Basil) is one of the most sacred herbs in India. It has adaptogenic properties that help the body adapt to stress, and it's commonly used for respiratory conditions, fever, and anxiety. The leaves contain essential oils like eugenol, which has antiseptic properties.";
        } else if (lowerContent.includes('ashwagandha')) {
          botResponse = "Ashwagandha is often referred to as 'Indian Ginseng' and is one of the most important herbs in Ayurvedic medicine. It helps reduce anxiety and stress, improves concentration, and increases energy levels. It's classified as an adaptogen, helping the body resist physiological and psychological stress.";
        } else if (lowerContent.includes('neem')) {
          botResponse = "Neem is known as 'the village pharmacy' in India due to its wide range of medicinal properties. It has antibacterial, antifungal, and blood-purifying properties. Neem is used for skin diseases, dental care, and as a natural pesticide. All parts of the tree - leaves, bark, flowers, seeds - are used in traditional remedies.";
        } else if (lowerContent.includes('herb') || lowerContent.includes('plant')) {
          botResponse = "The AYUSH Virtual Herbal Garden contains information about numerous medicinal herbs used in traditional Ayurvedic, Siddha, Unani, and other systems of medicine. Each herb has specific properties and uses for various health conditions. Would you like to learn about a particular herb?";
        } else {
          botResponse = "I'm here to help you learn about medicinal herbs and their traditional uses in AYUSH systems (Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy). You can ask me about specific herbs, their benefits, how to identify them, or general information about herbal medicine.";
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
        toast.error('Failed to get response from assistant');
        
        // Add error message
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting to the knowledge base. Please try again later.",
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, errorMessage]);
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
