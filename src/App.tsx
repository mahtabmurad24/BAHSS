import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { useState, useEffect } from "react";
import { SchoolWebsite } from "./components/SchoolWebsite";
import { AdminPanel } from "./components/AdminPanel";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminCodeModal, setShowAdminCodeModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [showSecretInput, setShowSecretInput] = useState(false);
  
  const isAdmin = useQuery(api.admin.isAdmin);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const initializeSuperAdmin = useMutation(api.admin.initializeSuperAdmin);

  // Listen for admin modal event from header
  useEffect(() => {
    const handleShowAdminModal = () => {
      setShowAdminCodeModal(true);
    };

    const handleToggleAdminPanel = () => {
      setShowAdmin(!showAdmin);
    };

    window.addEventListener('showAdminModal', handleShowAdminModal);
    window.addEventListener('toggleAdminPanel', handleToggleAdminPanel);
    return () => {
      window.removeEventListener('showAdminModal', handleShowAdminModal);
      window.removeEventListener('toggleAdminPanel', handleToggleAdminPanel);
    };
  }, [showAdmin]);

  const handleInitializeAdmin = async () => {
    if (!adminCode.trim()) {
      toast.error("Please enter the admin code");
      return;
    }

    // Check if it's super admin code
    if (adminCode.trim() === "SUPER2025ADMIN") {
      if (!showSecretInput) {
        setShowSecretInput(true);
        return;
      }
      
      if (!secretCode.trim()) {
        toast.error("Please enter the secret code");
        return;
      }
    }

    try {
      await initializeSuperAdmin({ 
        adminCode: adminCode.trim(),
        secretCode: secretCode.trim() || undefined
      });
      
      if (adminCode.trim() === "SUPER2025ADMIN") {
        toast.success("You are now a super admin! Refresh the page to see admin controls.");
      } else {
        toast.success("Admin request submitted! Please wait for approval from super admin.");
      }
      
      setShowAdminCodeModal(false);
      setAdminCode("");
      setSecretCode("");
      setShowSecretInput(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to process admin request");
    }
  };

  const resetModal = () => {
    setShowAdminCodeModal(false);
    setAdminCode("");
    setSecretCode("");
    setShowSecretInput(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      <Authenticated>
        {showAdmin && isAdmin ? (
          <AdminPanel />
        ) : (
          <SchoolWebsite />
        )}
      </Authenticated>

      <Unauthenticated>
        <SchoolWebsite />
      </Unauthenticated>

      {/* Admin Code Modal */}
      {showAdminCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full animate-scaleIn">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {showSecretInput ? "Enter Secret Code" : "Enter Admin Code"}
                </h2>
                <button
                  onClick={resetModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                {showSecretInput ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 text-sm">
                      🔐 Super Admin verification required. Enter the secret code to complete the process.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm font-medium">Regular Admin Code:</p>
                      <p className="text-green-700 text-sm">Use this to request admin access (requires approval)</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm font-medium">Super Admin Code:</p>
                      <p className="text-red-700 text-sm">Use this for immediate super admin access (requires secret code)</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {!showSecretInput ? (
                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter admin code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleInitializeAdmin();
                      }
                    }}
                  />
                ) : (
                  <input
                    type="password"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    placeholder="Enter secret code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleInitializeAdmin();
                      }
                    }}
                  />
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleInitializeAdmin}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    {showSecretInput ? "Verify Secret Code" : "Verify Code"}
                  </button>
                  <button
                    onClick={resetModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                
                {showSecretInput && (
                  <button
                    onClick={() => {
                      setShowSecretInput(false);
                      setSecretCode("");
                    }}
                    className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ← Back to admin code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
