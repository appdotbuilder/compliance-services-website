import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, CheckCircle, Users } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%)] bg-[length:20px_20px]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm mb-8">
            <Shield className="h-4 w-4 mr-2 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Trusted by 500+ organizations worldwide
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-6">
            Enterprise{' '}
            <span className="relative">
              Compliance
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-black"></div>
            </span>
            {' '}Made Simple
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Navigate SOC 2, ISO 27001, and GDPR compliance with confidence. 
            Our expert team transforms complex requirements into clear, actionable roadmaps.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={() => onNavigate('contact')}
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold group"
            >
              Start Your Compliance Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => onNavigate('services')}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-gray-300 hover:border-black hover:bg-gray-50"
            >
              View Our Services
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <CheckCircle className="h-6 w-6 text-gray-700" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">500+</div>
              <div className="text-sm text-gray-600">Successful Certifications</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <Users className="h-6 w-6 text-gray-700" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">98%</div>
              <div className="text-sm text-gray-600">Client Success Rate</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <Shield className="h-6 w-6 text-gray-700" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">3-6</div>
              <div className="text-sm text-gray-600">Months Average Timeline</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}