import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Campaign Dashboard';
      case '/builder':
        return 'Campaign Builder';
      case '/editor':
        return 'Campaign Editor';
      default:
        return 'LinkedIn Automation';
    }
  };

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-flow-message bg-clip-text text-transparent">
              LinkedIn Pro
            </Link>
            <nav className="hidden md:flex space-x-1">
              <Link to="/">
                <Button 
                  variant={location.pathname === '/' ? 'default' : 'ghost'}
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/builder">
                <Button 
                  variant={location.pathname === '/builder' ? 'default' : 'ghost'}
                  size="sm"
                >
                  New Campaign
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="sm"
              >
                Connect Account
              </Button>
            </nav>
          </div>
          <div className="text-lg font-semibold text-muted-foreground">
            {getPageTitle()}
          </div>
        </div>
      </div>
    </header>
  );
};