import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SchoolWebsite } from "./components/SchoolWebsite";
import { AdminPanel } from "./components/AdminPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminCodeModal, setShowAdminCodeModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [showSecretInput, setShowSecretInput] = useState(false);
  const [verifiedAdminCode, setVerifiedAdminCode] = useState<string | null>(null);

  const grantSuperAdmin = useMutation(api.admin.grantSuperAdmin);
  const initializeSuperAdmin = useMutation(api.admin.initializeSuperAdmin);

  const handleShowAdminModal = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.show) {
      setShowAdminCodeModal(true);
    }
  }, []);

  const handleCloseAdminPanel = useCallback(() => {
    setShowAdmin(false);
    setShowAdminCodeModal(false);
    setVerifiedAdminCode(null);
  }, []);

  useEffect(() => {
    window.addEventListener("showAdminModal", handleShowAdminModal);
    window.addEventListener("closeAdminPanel", handleCloseAdminPanel);
    return () => {
      window.removeEventListener("showAdminModal", handleShowAdminModal);
      window.removeEventListener("closeAdminPanel", handleCloseAdminPanel);
    };
  }, [handleShowAdminModal, handleCloseAdminPanel]);

  const handleAdminCodeSubmit = async () => {
    if (!adminCode.trim()) {
      toast.error("Please enter the admin code");
      return;
    }

    try {
      if (adminCode.trim() === "SUPER2025ADMIN" && !showSecretInput) {
        setShowSecretInput(true);
        return;
      }

      if (adminCode.trim() === "SUPER2025ADMIN" && !secretCode.trim()) {
        toast.error("Please enter the secret code");
        return;
      }

      if (adminCode.trim() === "SUPER2025ADMIN") {
        const result = await initializeSuperAdmin({
          adminCode: adminCode.trim(),
          secretCode: secretCode.trim(),
        });
        if (result.success) {
          toast.success("Super admin initialized successfully!");
          setVerifiedAdminCode(adminCode.trim());
          setShowAdmin(true);
          setShowAdminCodeModal(false);
          setAdminCode("");
          setSecretCode("");
          setShowSecretInput(false);
        } else {
          toast.error(result.message || "Failed to initialize super admin");
        }
      } else {
        const result = await grantSuperAdmin({ code: adminCode.trim() });
        if (result.isAdmin) {
          toast.success("Access granted to admin panel!");
          setVerifiedAdminCode(adminCode.trim());
          setShowAdmin(true);
          setShowAdminCodeModal(false);
          setAdminCode("");
          setSecretCode("");
          setShowSecretInput(false);
        } else {
          toast.error("Invalid admin code");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process admin code");
    }
  };

  const resetModal = () => {
    setShowAdminCodeModal(false);
    setAdminCode("");
    setSecretCode("");
    setShowSecretInput(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Toaster position="top-right" />
        {showAdmin && verifiedAdminCode ? (
          <AdminPanel adminCode={verifiedAdminCode} />
        ) : (
          <SchoolWebsite />
        )}
        {showAdminCodeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-6 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 animate-scaleIn">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Enter Admin Code
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Code
                  </label>
                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter admin code"
                  />
                </div>
                {showSecretInput && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secret Code
                    </label>
                    <input
                      type="password"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter secret code"
                    />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleAdminCodeSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={resetModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}