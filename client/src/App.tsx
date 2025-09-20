import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import type { Service, CompanyInfo, CreateContactFormInput } from '../../server/src/schema';

// Components
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { ServiceDetail } from '@/components/ServiceDetail';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

type Page = 'home' | 'services' | 'about' | 'contact' | string;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [services, setServices] = useState<Service[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [servicesData, companyData] = await Promise.all([
        trpc.getServices.query(),
        trpc.getCompanyInfo.query()
      ]);
      setServices(servicesData);
      setCompanyInfo(companyData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleContactSubmit = async (data: CreateContactFormInput) => {
    try {
      await trpc.createContactForm.mutate(data);
      alert('Thank you for your inquiry! We will get back to you within 24 hours.');
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('There was an error submitting your inquiry. Please try again or contact us directly.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if it's a service detail page (service slug)
  const serviceSlug = services.find((service: Service) => service.slug === currentPage)?.slug;
  const selectedService = services.find((service: Service) => service.slug === currentPage);

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main>
        {currentPage === 'home' && (
          <>
            <Hero onNavigate={setCurrentPage} />
            <Services services={services} onNavigate={setCurrentPage} />
          </>
        )}
        
        {currentPage === 'services' && (
          <Services services={services} onNavigate={setCurrentPage} />
        )}
        
        {serviceSlug && selectedService && (
          <ServiceDetail service={selectedService} onNavigate={setCurrentPage} />
        )}
        
        {currentPage === 'about' && companyInfo && (
          <About companyInfo={companyInfo} />
        )}
        
        {currentPage === 'contact' && (
          <Contact onSubmit={handleContactSubmit} />
        )}
      </main>
      
      <Footer companyInfo={companyInfo} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;