
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Leaf, Send, X } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ChatMessage } from '@/types';

const ChatInterface: React.FC = () => {
  const { messages, loading, sendMessage, clearChat } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!messageInput.trim() || loading) return;
    
    try {
      await sendMessage(messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    
    if (isSystem) {
      return (
        <div className="flex items-center justify-center my-4">
          <div className="bg-muted px-4 py-2 rounded-md text-sm text-muted-foreground max-w-md">
            {message.content}
          </div>
        </div>
      );
    }
    
    return (
      <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <Avatar className="h-8 w-8">
            <div className="h-full w-full flex items-center justify-center bg-herb-primary text-white">
              <Leaf size={16} />
            </div>
          </Avatar>
        )}
        
        <div className={`px-4 py-3 rounded-lg max-w-[80%] ${
          isUser 
            ? 'bg-herb-primary text-white' 
            : 'bg-muted text-foreground'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <div className={`text-xs mt-1 ${
            isUser ? 'text-white/70' : 'text-muted-foreground'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        
        {isUser && (
          <Avatar className="h-8 w-8">
            <div className="h-full w-full flex items-center justify-center bg-herb-secondary text-white">
              {isUser ? 'U' : 'A'}
            </div>
          </Avatar>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="bg-herb-primary text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf size={18} />
          <h3 className="font-medium">AYUSH Herbal Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearChat}
          className="h-8 w-8 text-white hover:bg-herb-primary/80"
        >
          <X size={16} />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {loading && (
            <div className="flex gap-3 my-4">
              <Avatar className="h-8 w-8">
                <div className="h-full w-full flex items-center justify-center bg-herb-primary text-white">
                  <Leaf size={16} className="animate-pulse" />
                </div>
              </Avatar>
              <div className="px-4 py-3 rounded-lg bg-muted">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Ask about medicinal herbs..."
            className="flex-1"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={!messageInput.trim() || loading}
            className="bg-herb-primary hover:bg-herb-secondary"
          >
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
