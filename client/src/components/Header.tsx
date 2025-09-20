import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' }
  ];

  const NavLinks = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <div className={mobile ? 'flex flex-col space-y-4 pt-4' : 'hidden md:flex items-center space-x-8'}>
      {navItems.map((item) => (
        <button
          key={item.page}
          onClick={() => {
            onNavigate(item.page);
            onItemClick?.();
          }}
          className={`text-sm font-medium transition-colors hover:text-black ${
            currentPage === item.page
              ? 'text-black border-b-2 border-black pb-1'
              : 'text-gray-600'
          } ${mobile ? 'text-base py-2 border-b-0 hover:bg-gray-50 px-4 -mx-4 rounded' : ''}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="text-xl font-bold text-black hover:text-gray-800 transition-colors"
          >
            ComplianceCore
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavLinks />
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Button
              onClick={() => onNavigate('contact')}
              className="bg-black text-white hover:bg-gray-800 px-6"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h3 className="font-semibold text-lg">ComplianceCore</h3>
                    <p className="text-sm text-gray-600 mt-1">Professional Compliance Services</p>
                  </div>
                  
                  <NavLinks mobile={true} />
                  
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <Button
                      onClick={() => onNavigate('contact')}
                      className="w-full bg-black text-white hover:bg-gray-800"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}