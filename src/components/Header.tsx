import { useState, useEffect } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";
import { SignInForm } from "../SignInForm";

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const isAdmin = useQuery(api.admin.isAdmin);

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
                  className="w-10 h-10 object-contain"/>
              </div>
              <div>
                <h1 className={`text-lg font-bold leading-tight transition-colors duration-300 ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}>
                  Badda Alatunnesa
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isScrolled ? "text-gray-600" : "text-gray-200"
                }`}>
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
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full animate-pulse ${
                      isScrolled ? "bg-blue-600" : "bg-blue-300"
                    }`} />
                  )}
                </button>
              ))}
              
              <div className="flex items-center space-x-3 ml-4">
                <Authenticated>
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isScrolled
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                          : "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                      }`}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {loggedInUser?.name?.charAt(0) || loggedInUser?.email?.charAt(0) || "U"}
                        </span>
                      </div>
                      <span className="hidden md:block">Profile</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {loggedInUser?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {loggedInUser?.email}
                          </p>
                        </div>
                        
                        {isAdmin ? (
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              const event = new CustomEvent('toggleAdminPanel');
                              window.dispatchEvent(event);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            ⚡ Admin Panel
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              // This will be handled by the parent component
                              const event = new CustomEvent('showAdminModal');
                              window.dispatchEvent(event);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            🔐 Become Admin
                          </button>
                        )}
                        
                        <button
                          onClick={() => setShowProfileMenu(false)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          ⚙️ Settings
                        </button>
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <div className="px-4 py-2">
                            <SignOutButton />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Authenticated>
                
                <Unauthenticated>
                  <button
                    onClick={() => setShowSignIn(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      isScrolled
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        : "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                    }`}
                  >
                    Sign In
                  </button>
                </Unauthenticated>
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
              
              <Authenticated>
                <div className="px-4 py-3 border-t border-gray-200 mt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {loggedInUser?.name?.charAt(0) || loggedInUser?.email?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {loggedInUser?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {loggedInUser?.email}
                      </p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        const event = new CustomEvent('toggleAdminPanel');
                        window.dispatchEvent(event);
                      }}
                      className="w-full mb-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      ⚡ Admin Panel
                    </button>
                  )}
                  
                  <SignOutButton />
                </div>
              </Authenticated>
              
              <Unauthenticated>
                <div className="px-4 py-3 border-t border-gray-200 mt-2">
                  <button
                    onClick={() => {
                      setShowSignIn(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </Unauthenticated>
            </div>
          )}
        </div>
      </header>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full animate-scaleIn">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                <button
                  onClick={() => setShowSignIn(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-2">Sign in to access your account</p>
            </div>
            <div className="p-6">
              <SignInForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
