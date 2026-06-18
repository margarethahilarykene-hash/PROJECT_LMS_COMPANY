"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, User } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Tab State: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Form Field States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Field Error States
  const [errors, setErrors] = useState({ name: false, email: false, password: false });

  // Status States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Validate inputs
  const validateForm = () => {
    const newErrors = {
      name: activeTab === "signup" && !name.trim(),
      email: !email.trim(),
      password: !password,
    };
    setErrors(newErrors);

    if (activeTab === "signup" && (newErrors.name || newErrors.email || newErrors.password)) {
      setMessage({
        type: "error",
        text: "Registration failed! All fields marked with an asterisk (*) are required."
      });
      return false;
    }

    if (activeTab === "signin") {
      if (newErrors.email || newErrors.password) {
        setMessage({
          type: "error",
          text: "Login failed! Both email and password are required."
        });
        return false;
      }
    }

    if (activeTab === "signup") {
      if (password.length < 6) {
        setMessage({ type: "error", text: "Password must be at least 6 characters." });
        setErrors(prev => ({ ...prev, password: true }));
        return false;
      }
    }

    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (activeTab === "signin") {
        // Sign In Flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          setMessage({ type: "success", text: "Success! Redirecting to dashboard..." });
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1500);
        }
      } else {
        // Sign Up Flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: name,
            },
          },
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          const isConfirmRequired = data?.session === null;
          if (isConfirmRequired) {
            setMessage({
              type: "success",
              text: "Registration successful! Please check your email inbox to confirm your account.",
            });
          } else {
            setMessage({ type: "success", text: "Account created successfully! Redirecting..." });
            setTimeout(() => {
              router.push("/dashboard");
              router.refresh();
            }, 1500);
          }
        }
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 sm:px-8 lg:px-12 flex flex-col justify-center relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl flex-col justify-center relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* Left branding section */}
          <section className="space-y-6 text-center lg:text-left">
            <div className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-sm font-medium text-sky-200 ring-1 ring-sky-500/20">
              LMS Company
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Learning Management System
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base mx-auto lg:mx-0">
                Sign in to start exploring training modules and upgrade employee skills professionally.
              </p>
            </div>
          </section>

          {/* Right stateful Auth card section */}
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.9)] backdrop-blur-sm sm:p-10">
            <div className="space-y-6">

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-950 border border-white/5 rounded-xl">
                <button
                  id="landing-tab-signin"
                  type="button"
                  suppressHydrationWarning={true}
                  onClick={() => {
                    setActiveTab("signin");
                    setMessage(null);
                    setErrors({ name: false, email: false, password: false });
                  }}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${activeTab === "signin"
                    ? "bg-sky-500 text-white shadow"
                    : "text-slate-400 hover:text-white"
                    }`}
                >
                  Sign In
                </button>
                <button
                  id="landing-tab-signup"
                  type="button"
                  suppressHydrationWarning={true}
                  onClick={() => {
                    setActiveTab("signup");
                    setMessage(null);
                    setErrors({ name: false, email: false, password: false });
                  }}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${activeTab === "signup"
                    ? "bg-sky-500 text-white shadow"
                    : "text-slate-400 hover:text-white"
                    }`}
                >
                  Register
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {activeTab === "signin" ? "Welcome" : "Join Us Today"}
                </p>
                <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
                  {activeTab === "signin" ? "Sign in to your account" : "Create a new account"}
                </h2>
              </div>

              {/* Status Notifications */}
              {message && (
                <div
                  id="landing-auth-alert"
                  className={`flex items-start gap-3 p-4 rounded-xl border text-sm animate-fade-in ${message.type === "error"
                    ? "bg-red-500/10 border-red-500/30 text-red-200"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                    }`}
                >
                  {message.type === "error" ? (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                  )}
                  <span className="leading-snug">{message.text}</span>
                </div>
              )}

              {/* Form Input fields */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {activeTab === "signup" && (
                  <div className="space-y-2">
                    <label htmlFor="landing-name" className="text-sm font-medium text-slate-300">
                      Full Name *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        id="landing-name"
                        type="text"
                        required
                        suppressHydrationWarning={true}
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors(prev => ({ ...prev, name: false }));
                        }}
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3 text-sm rounded-2xl border bg-slate-950/90 text-white placeholder:text-slate-500 outline-none transition focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-sky-400'
                          }`}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="landing-email" className="text-sm font-medium text-slate-300">
                    Email Address {activeTab === "signup" ? "*" : ""}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="landing-email"
                      type="email"
                      required
                      suppressHydrationWarning={true}
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors(prev => ({ ...prev, email: false }));
                      }}
                      disabled={loading}
                      className={`w-full pl-10 pr-4 py-3 text-sm rounded-2xl border bg-slate-950/90 text-white placeholder:text-slate-500 outline-none transition focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-sky-400'
                        }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="landing-password" className="text-sm font-medium text-slate-300">
                    Password {activeTab === "signup" ? "*" : ""}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="landing-password"
                      type={showPassword ? "text" : "password"}
                      required
                      suppressHydrationWarning={true}
                      placeholder={activeTab === "signin" ? "Enter your password" : "Choose a password (min. 6 characters)"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors(prev => ({ ...prev, password: false }));
                      }}
                      disabled={loading}
                      className={`w-full pl-10 pr-10 py-3 text-sm rounded-2xl border bg-slate-950/90 text-white placeholder:text-slate-500 outline-none transition focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-sky-400'
                        }`}
                    />
                    <button
                      id="landing-toggle-password"
                      type="button"
                      suppressHydrationWarning={true}
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="landing-submit"
                  type="submit"
                  suppressHydrationWarning={true}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {activeTab === "signin" ? "Processing..." : "Registering..."}
                    </>
                  ) : (
                    <>{activeTab === "signin" ? "Sign In" : "Register Now"}</>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 leading-snug">
                Connected to Supabase Auth backend. All data is securely encrypted.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
