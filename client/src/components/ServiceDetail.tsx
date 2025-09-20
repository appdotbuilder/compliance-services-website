import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import type { Service } from '../../../server/src/schema';

interface ServiceDetailProps {
  service: Service;
  onNavigate: (page: string) => void;
}

export function ServiceDetail({ service, onNavigate }: ServiceDetailProps) {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('services')}
          className="mb-8 hover:bg-gray-100 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Button>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <Badge variant="outline" className="mr-4 px-3 py-1">
              {service.name}
            </Badge>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {service.timeline}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            {service.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mb-8">
            {service.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => onNavigate('contact')}
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 group"
            >
              Get Started with {service.name}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => onNavigate('contact')}
              variant="outline"
              size="lg"
              className="px-8 border-gray-300 hover:border-black hover:bg-gray-50"
            >
              Schedule Consultation
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Benefits */}
          <Card className="p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 mr-4">
                <Shield className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-bold text-black">Key Benefits</h2>
            </div>
            <ul className="space-y-4">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Process */}
          <Card className="p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 mr-4">
                <CheckCircle className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-bold text-black">Our Process</h2>
            </div>
            <div className="space-y-6">
              {service.process_steps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white text-sm font-semibold flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <div className="pt-1">
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Timeline & Next Steps */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-black mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Most {service.name} implementations are completed within {service.timeline}. 
              Let's discuss your specific requirements and create a customized roadmap for your organization.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-gray-200 mb-3">
                  <Clock className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-black mb-2">Typical Timeline</h3>
                <p className="text-gray-600">{service.timeline}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-gray-200 mb-3">
                  <CheckCircle className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-black mb-2">Success Rate</h3>
                <p className="text-gray-600">98% first-time pass</p>
              </div>
            </div>
            
            <Button
              onClick={() => onNavigate('contact')}
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8"
            >
              Start Your {service.name} Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}