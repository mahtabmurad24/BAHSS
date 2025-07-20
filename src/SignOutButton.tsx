"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-md hover:shadow-lg btn-animate"
      onClick={() => void signOut()}
    >
      Sign Out
    </button>
  );
}