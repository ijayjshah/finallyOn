import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/app/dashboard");
    } else {
      setError(result.error ?? "Login failed.");
    }
  };

  const fillDemo = () => {
    setEmail("demo@foundwork.in");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Foundwork
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <circle cx="4" cy="4" r="2" fill="white" />
              <circle cx="14" cy="4" r="2" fill="white" opacity="0.65" />
              <circle cx="4" cy="14" r="2" fill="white" opacity="0.65" />
              <circle cx="14" cy="14" r="2" fill="white" />
              <circle cx="9" cy="9" r="1.5" fill="white" opacity="0.85" />
            </svg>
          </div>
          <span className="font-bold text-base text-foreground">Foundwork</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your Foundwork account</p>
          </div>

          {/* Demo hint */}
          <div className="mb-6 p-4 rounded-xl bg-primary/8 border border-primary/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Try the demo account</p>
              <p className="text-xs text-muted-foreground">demo@foundwork.in · demo123</p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Fill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                data-testid="input-login-email"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  data-testid="input-login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              data-testid="button-login-submit"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary font-semibold hover:underline"
            >
              Create one free
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
