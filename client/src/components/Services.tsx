import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Clock, CheckCircle, FileCheck } from 'lucide-react';
import type { Service } from '../../../server/src/schema';

interface ServicesProps {
  services: Service[];
  onNavigate: (page: string) => void;
}

export function Services({ services, onNavigate }: ServicesProps) {
  const serviceIcons = {
    'soc2': FileCheck,
    'iso27001': CheckCircle,
    'gdpr': Clock,
    'general': FileCheck
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
            Compliance Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive compliance solutions tailored to your industry and business needs. 
            From initial assessment to certification, we guide you through every step.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service: Service) => {
            const IconComponent = serviceIcons[service.slug as keyof typeof serviceIcons] || FileCheck;
            
            return (
              <Card 
                key={service.id} 
                className="p-8 border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg group cursor-pointer"
                onClick={() => onNavigate(service.slug)}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-black transition-colors duration-300 mb-4">
                    <IconComponent className="h-6 w-6 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-3">{service.name}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">Timeline: {service.timeline}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">{service.benefits.length} Key Benefits</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 hover:border-black hover:bg-black hover:text-white group/btn"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onNavigate(service.slug);
                  }}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-black mb-4">
            Not sure which service you need?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our compliance experts will assess your current state and recommend the best path forward. 
            Get a free consultation to understand your compliance requirements.
          </p>
          <Button
            onClick={() => onNavigate('contact')}
            size="lg"
            className="bg-black text-white hover:bg-gray-800 px-8"
          >
            Schedule Free Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}