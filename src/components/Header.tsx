import { useState, useEffect } from "react";
import { ProfileButton } from "../ProfileButton";

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "academics", label: "Academics" },
    { id: "teachers", label: "Teachers" },
    { id: "gallery", label: "Gallery" },
    { id: "notices", label: "Notices" },
    { id: "contact", label: "Contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo and School Name */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="https://i.ibb.co/k6Gz8ZkC/Logo.png"
                  alt="School Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1
                  className={`text-lg font-bold leading-tight transition-colors duration-300 ${
                    isScrolled ? "text-gray-800" : "text-white"
                  }`}
                >
                  Badda Alatunnesa
                </h1>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isScrolled ? "text-gray-600" : "text-gray-200"
                  }`}
                >
                  Higher Secondary School & College
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? isScrolled
                        ? "text-blue-600"
                        : "text-blue-300"
                      : isScrolled
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white hover:text-blue-300"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full animate-pulse ${
                        isScrolled ? "bg-blue-600" : "bg-blue-300"
                      }`}
                    />
                  )}
                </button>
              ))}
              <div className="flex items-center space-x-3 ml-4">
                <ProfileButton />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
              }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div
                  className={`h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-gray-600" : "bg-white"
                  } ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                />
                <div
                  className={`h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-gray-600" : "bg-white"
                  } ${isMobileMenuOpen ? "opacity-0" : ""}`}
                />
                <div
                  className={`h-0.5 transition-all duration-300 ${
                    isScrolled ? "bg-gray-600" : "bg-white"
                  } ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 py-4 animate-fadeIn">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="px-4 py-3 border-t border-gray-200 mt-2">
                <ProfileButton />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}