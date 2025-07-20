"use client";
import React from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState<boolean>(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 glass animate-fadeIn">
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 bg-white/5 border border-gray-300/30 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
          <input
            className="w-full px-4 py-3 bg-white/5 border border-gray-300/30 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg btn-animate disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <span className="spinner mr-2"></span>
              {flow === "signIn" ? "Signing in..." : "Signing up..."}
            </span>
          ) : (
            flow === "signIn" ? "Sign In" : "Sign Up"
          )}
        </button>
        <div className="text-center text-sm text-gray-400">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-4">
        <hr className="grow border-gray-300/30" />
        <span className="mx-4 text-gray-400 text-sm">or</span>
        <hr className="grow border-gray-300/30" />
      </div>
      <button
        className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-gray-200 px-4 py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-black hover:text-gray-200 transition-all duration-300 shadow-md hover:shadow-lg btn-animate"
        onClick={() => void signIn("anonymous")}
      >
        Sign in Anonymously
      </button>
      {/* Fallback message with 🔔 emoji */}
      {submitting && !toast && (
        <div className="text-center py-6 mt-6">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing...</h3>
          <p className="text-gray-600">Please wait while we process your request.</p>
        </div>
      )}
    </div>
  );
}