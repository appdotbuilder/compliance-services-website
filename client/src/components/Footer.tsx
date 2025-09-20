import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { CompanyInfo } from '../../../server/src/schema';

interface FooterProps {
  companyInfo: CompanyInfo | null;
  onNavigate: (page: string) => void;
}

export function Footer({ companyInfo, onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">ComplianceCore</h3>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              {companyInfo?.mission || 'Professional compliance services for modern businesses. Simplifying SOC 2, ISO 27001, and GDPR compliance.'}
            </p>
            <Button
              onClick={() => onNavigate('contact')}
              variant="outline"
              className="border-gray-600 text-white hover:bg-white hover:text-black"
            >
              Get Started
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('soc2')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  SOC 2 Compliance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('iso27001')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ISO 27001 Certification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gdpr')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  GDPR Compliance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Free Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              {companyInfo?.contact_email && (
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                  <a
                    href={`mailto:${companyInfo.contact_email}`}
                    className="hover:text-white transition-colors break-all"
                  >
                    {companyInfo.contact_email}
                  </a>
                </div>
              )}
              
              {companyInfo?.contact_phone && (
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <a
                    href={`tel:${companyInfo.contact_phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {companyInfo.contact_phone}
                  </a>
                </div>
              )}
              
              {companyInfo?.address && (
                <div className="flex items-start text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                  <address className="not-italic text-sm leading-relaxed">
                    {companyInfo.address}
                  </address>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 md:mb-0">
            <p className="text-gray-300 text-sm">
              © {currentYear} ComplianceCore. All rights reserved.
            </p>
            {companyInfo?.founded_year && (
              <p className="text-gray-400 text-sm">
                Serving clients since {companyInfo.founded_year}
              </p>
            )}
          </div>

          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('about')}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              About Us
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Services
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}