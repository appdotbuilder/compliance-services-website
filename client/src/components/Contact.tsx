import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import type { CreateContactFormInput } from '../../../server/src/schema';

interface ContactProps {
  onSubmit: (data: CreateContactFormInput) => Promise<void>;
}

export function Contact({ onSubmit }: ContactProps) {
  const [formData, setFormData] = useState<CreateContactFormInput>({
    name: '',
    email: '',
    company: null,
    phone: null,
    service: 'General',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        company: null,
        phone: null,
        service: 'General',
        message: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            Get Started Today
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Ready to simplify your compliance journey? Contact our experts for a free consultation 
            and discover how we can help your organization achieve certification.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateContactFormInput) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Your full name"
                      required
                      className="border-gray-300 focus:border-black"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateContactFormInput) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="your.email@company.com"
                      required
                      className="border-gray-300 focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateContactFormInput) => ({ 
                          ...prev, 
                          company: e.target.value || null 
                        }))
                      }
                      placeholder="Your company name"
                      className="border-gray-300 focus:border-black"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateContactFormInput) => ({ 
                          ...prev, 
                          phone: e.target.value || null 
                        }))
                      }
                      placeholder="+1 (555) 123-4567"
                      className="border-gray-300 focus:border-black"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Interest *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value: 'SOC2' | 'ISO27001' | 'GDPR' | 'General') =>
                      setFormData((prev: CreateContactFormInput) => ({ ...prev, service: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-black">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOC2">SOC 2 Compliance</SelectItem>
                      <SelectItem value="ISO27001">ISO 27001 Certification</SelectItem>
                      <SelectItem value="GDPR">GDPR Compliance</SelectItem>
                      <SelectItem value="General">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData((prev: CreateContactFormInput) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Tell us about your compliance needs, current state, and any specific requirements..."
                    rows={6}
                    required
                    className="border-gray-300 focus:border-black resize-none"
                  />
                  <p className="text-sm text-gray-500">Minimum 10 characters required</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-black text-white hover:bg-gray-800 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-black mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-black">Email</p>
                    <p className="text-gray-600">info@complianceservices.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-black">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-black">Address</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      123 Business District<br />
                      Suite 456<br />
                      Professional City, PC 12345
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-black mb-4">Response Time</h3>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-black">Within 24 Hours</p>
                  <p className="text-gray-600 text-sm">
                    We typically respond to all inquiries within one business day. 
                    For urgent matters, please call us directly.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-gray-200 bg-gray-50">
              <h3 className="text-lg font-bold text-black mb-3">Free Consultation</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every engagement starts with a complimentary consultation to understand 
                your current compliance posture and identify the best path forward.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}