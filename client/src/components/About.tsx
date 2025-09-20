import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Heart, Lightbulb, Award, Shield } from 'lucide-react';
import type { CompanyInfo } from '../../../server/src/schema';

interface AboutProps {
  companyInfo: CompanyInfo;
}

export function About({ companyInfo }: AboutProps) {
  const valueIcons = {
    0: Target,      // Transparency
    1: Award,       // Excellence
    2: Heart,       // Integrity
    3: Lightbulb,   // Innovation
    4: Shield       // Client success
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            About ComplianceCore
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Founded in {companyInfo.founded_year}, we've been simplifying enterprise compliance 
            for organizations worldwide, making complex security frameworks accessible to businesses of all sizes.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <Card className="p-12 border border-gray-200 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-8">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {companyInfo.mission}
              </p>
            </div>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every relationship we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.values.map((value, index) => {
              const IconComponent = valueIcons[index as keyof typeof valueIcons] || Heart;
              
              return (
                <Card key={index} className="p-8 border border-gray-200 hover:border-black transition-colors duration-300">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-6">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {value}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Our Expert Team</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {companyInfo.team_description}
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">50+</div>
                  <div className="text-sm text-gray-600">Security Experts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
            
            <Card className="p-8 border border-gray-200 bg-gray-50">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-700 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-black mb-4">Leadership Team</h3>
                <p className="text-gray-600 mb-6">
                  Former auditors from Big 4 firms, security consultants, and compliance specialists 
                  with deep expertise across multiple frameworks.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                    CISSP Certified
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                    ISO 27001 Lead Auditor
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                    CISA Certified
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="p-12 border border-gray-200 bg-black text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-300 text-lg mb-8">
              Ready to start your compliance journey? We'd love to hear from you.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-300">{companyInfo.contact_email}</p>
              </div>
              {companyInfo.contact_phone && (
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-300">{companyInfo.contact_phone}</p>
                </div>
              )}
            </div>
            
            {companyInfo.address && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-300">{companyInfo.address}</p>
              </div>
            )}
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = 'mailto:' + companyInfo.contact_email}
              className="bg-white text-black hover:bg-gray-100"
            >
              Send us an Email
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}