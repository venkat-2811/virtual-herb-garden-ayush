
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">
          Herbal Knowledge Assistant
        </h1>
        <p className="text-gray-600">
          Chat with our AI assistant to learn more about medicinal herbs and their uses. Ask questions about specific herbs, their benefits, or general information about herbal medicine.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChatInterface />
        </div>
        
        <div>
          <div className="bg-herb-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Suggested Questions</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                What are the benefits of Tulsi?
              </li>
              <li className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                How can I identify Ashwagandha?
              </li>
              <li className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                What herbs help with anxiety?
              </li>
              <li className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                Can you compare Brahmi and Gotu Kola?
              </li>
              <li className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                What are the contraindications for Neem?
              </li>
            </ul>
          </div>
          
          <div className="mt-6 p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">About the Assistant</h2>
            <p className="text-gray-700 mb-4">
              The AYUSH Herbal Assistant is powered by Google's Gemini AI model. It has been trained on a comprehensive database of traditional medicinal herbs, their uses, and scientific research.
            </p>
            <p className="text-gray-700 mb-4">
              While the assistant provides valuable information, please remember that it should not replace professional medical advice. Always consult with a healthcare practitioner before using any herb medicinally.
            </p>
            <p className="text-sm text-gray-500">
              Model: Gemini 2.0 Flash
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
