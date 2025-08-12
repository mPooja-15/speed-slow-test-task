import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavigationProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  isLoggedIn?: boolean;
}

const Navigation = ({ cartItemsCount, onCartClick, onLoginClick, onProfileClick, isLoggedIn = false }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              SpeedySellFlow
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-primary/10">
              Categories
            </Button>
            <Button variant="ghost" className="hover:bg-primary/10">
              Deals
            </Button>
            {isLoggedIn ? (
              <Button
                variant="ghost"
                onClick={() => {
                  console.log('Navigation Profile button clicked');
                  onProfileClick();
                }}
                className="hover:bg-primary/10"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={onLoginClick}
                className="hover:bg-primary/10"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onCartClick}
              className="relative hover:bg-primary/10 border-primary/20"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-1 text-xs bg-primary text-primary-foreground">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start">
                Categories
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Deals
              </Button>
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    console.log('Mobile Navigation Profile button clicked');
                    onProfileClick();
                  }}
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={onLoginClick}
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onCartClick}
                className="w-full justify-start relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartItemsCount > 0 && (
                  <Badge className="ml-auto h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;