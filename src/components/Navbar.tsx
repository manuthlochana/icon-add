import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Education", path: "/education" },
    { name: "Docs", path: "/docs" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass-panel shadow-lg" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="Manuth Logo" 
              className="h-12 w-auto smooth-transition group-hover:scale-110 invert dark:invert-0"
            />
            <span className="text-2xl font-bold text-primary tracking-tight font-sans">Manuth</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-foreground/80 hover:text-primary smooth-transition font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                    location.pathname === item.path && "text-primary after:w-full"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <a href="/auth" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                Admin
              </a>
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-primary via-primary to-blue-600 hover:from-primary/90 hover:via-primary/90 hover:to-blue-700 smooth-transition shadow-lg"
                asChild
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-primary smooth-transition"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 glass-panel rounded-2xl p-6 animate-fadeInUp shadow-2xl border border-primary/20">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-left text-foreground/80 hover:text-primary hover:bg-primary/10 smooth-transition font-medium py-3 px-4 rounded-lg",
                    location.pathname === item.path && "text-primary bg-primary/10"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4 mt-4 border-t border-primary/20">
                <div className="px-4">
                  <ThemeToggle />
                </div>
                <a 
                  href="/auth" 
                  className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 smooth-transition text-left py-3 px-4 rounded-lg"
                >
                  Admin Login
                </a>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-primary via-primary to-blue-600 hover:from-primary/90 hover:via-primary/90 hover:to-blue-700 smooth-transition shadow-lg w-full"
                  asChild
                >
                  <Link to="/contact" onClick={() => setIsOpen(false)}>Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;