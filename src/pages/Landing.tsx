
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Leaf, Search, Book, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-herb-primary/90 to-herb-water/90 z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
          style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2019/11/23/02/15/medicinal-4646844_1280.jpg')" }}
        />
        
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-3xl">
            <Logo size="lg" textColor="text-white" />
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mt-6">
              Explore the Wisdom of <span className="text-herb-light">Traditional Herbs</span> in a Modern Experience
            </h1>
            
            <p className="text-white/90 text-lg md:text-xl mt-6">
              Discover the healing powers of medicinal herbs through interactive 3D models, AI-powered insights, and a comprehensive knowledge base.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Button asChild size="lg" className="bg-white text-herb-primary hover:bg-gray-100">
                <Link to="/register">
                  Get Started
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                <Link to="/explore">
                  Explore Herbs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Experience the Virtual Herbal Garden
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              AYUSH Virtual Herbal Garden offers a unique blend of traditional herbal knowledge and modern technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-herb-primary/10 flex items-center justify-center mb-6">
                <Leaf className="text-herb-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Interactive 3D Models</h3>
              <p className="text-gray-600">
                Explore herbs in three dimensions, rotate, zoom, and examine them from every angle to better understand their structure and characteristics.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-herb-primary/10 flex items-center justify-center mb-6">
                <Search className="text-herb-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Advanced Search & Filter</h3>
              <p className="text-gray-600">
                Find herbs based on region, medicinal use, chemical composition, or specific properties to quickly access the information you need.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-herb-primary/10 flex items-center justify-center mb-6">
                <Book className="text-herb-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">AI Herbal Assistant</h3>
              <p className="text-gray-600">
                Chat with our intelligent assistant to get answers to your herbal queries, recommendations, and insights about traditional medicinal herbs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-herb-primary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Join the AYUSH Virtual Herbal Garden
            </h2>
            <p className="text-gray-600 mb-8">
              Create an account to explore the full features of the platform, save your favorite herbs, and interact with our AI assistant.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-herb-primary hover:bg-herb-secondary">
                <Link to="/register">
                  Sign Up Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
