import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ShieldCheck, ArrowRight, RefreshCw, Skull } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DUMMY_OTP = "1234";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");

  const validateMobile = (val: string) => /^[6-9]\d{9}$/.test(val);

  const handleSendOtp = async () => {
    if (!validateMobile(mobile)) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep("otp");
    toast.success("OTP sent!", { description: `Use ${DUMMY_OTP} for demo` });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const entered = otp.join("");
    if (entered.length !== 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (entered === DUMMY_OTP) {
      login(mobile);
      toast.success("Welcome back, Partner! 🎉");
      navigate("/");
    } else {
      setLoading(false);
      toast.error("Incorrect OTP", { description: `Hint: use ${DUMMY_OTP}` });
      setOtp(["", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", ""]);
    toast.success("OTP resent!", { description: `Use ${DUMMY_OTP} for demo` });
    document.getElementById("otp-0")?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-14">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-primary/5 blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl purple-gradient shadow-lg mb-5">
            <Skull className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Happirate <span className="purple-text">Fleet</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide">Partner Portal</p>
        </div>

        {/* Card */}
        <div className="card-elevated rounded-2xl px-8 py-10 shadow-xl md:px-12">
          <AnimatePresence mode="wait">

            {/* ── STEP: Mobile ── */}
            {step === "mobile" && (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Step header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Sign In</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Enter your registered mobile number</p>
                  </div>
                </div>

                {/* Mobile input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Mobile Number</label>
                  <div className={cn(
                    "flex items-center gap-3 rounded-xl border bg-background px-4 h-13 transition-all",
                    "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
                    mobileError ? "border-destructive" : "border-border"
                  )}>
                    <span className="text-sm font-semibold text-muted-foreground border-r border-border pr-3 py-3">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value.replace(/\D/g, ""));
                        setMobileError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      placeholder="10-digit mobile number"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-3"
                      autoFocus
                    />
                  </div>
                  {mobileError && (
                    <p className="text-xs text-destructive font-medium mt-1">{mobileError}</p>
                  )}
                </div>

                {/* Send OTP button */}
                <button
                  onClick={handleSendOtp}
                  disabled={loading || mobile.length !== 10}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold transition-all mt-2",
                    "purple-gradient text-primary-foreground shadow-md hover:opacity-90 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  )}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <><span>Send OTP</span><ArrowRight className="h-4 w-4" /></>
                  )}
                </button>

                <p className="text-center text-sm text-muted-foreground pt-1">
                  Demo: any valid 10-digit number works
                </p>

                {/* Divider + Register link */}
                <div className="border-t border-border pt-5 mt-2">
                  <p className="text-center text-md text-muted-foreground">
                    New partner?{" "}
                    <button
                      onClick={() => navigate("/register")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── STEP: OTP ── */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Step header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Verify OTP</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Sent to +91 {mobile.slice(0, 5)}*****
                    </p>
                  </div>
                </div>

                {/* OTP Boxes */}
                <div className="flex gap-4 justify-center my-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={cn(
                        "h-16 w-16 rounded-xl border-2 bg-background text-center text-2xl font-bold text-foreground",
                        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                        digit ? "border-primary bg-primary/5" : "border-border"
                      )}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {/* Demo hint */}
                <div className="rounded-xl bg-primary/5 border border-primary/20 px-5 py-3 text-center my-2">
                  <p className="text-sm text-primary font-medium">
                    Demo OTP: <span className="font-bold tracking-[0.3em]">{DUMMY_OTP}</span>
                  </p>
                </div>

                {/* Verify button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join("").length !== 4}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold transition-all mt-2",
                    "purple-gradient text-primary-foreground shadow-md hover:opacity-90 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  )}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <><span>Verify & Login</span><ShieldCheck className="h-4 w-4" /></>
                  )}
                </button>

                {/* Change number / Resend */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                  <button
                    onClick={() => setStep("mobile")}
                    className="hover:text-foreground transition-colors"
                  >
                    ← Change Number
                  </button>
                  <button
                    onClick={handleResend}
                    className="text-primary font-semibold hover:underline transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 mb-2">
          © 2026 Happirate Fleet · Partner Portal
        </p>
      </motion.div>
    </div>
  );
};

export default Login;