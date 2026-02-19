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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl purple-gradient shadow-lg mb-4">
            <Skull className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Happirate <span className="purple-text">Fleet</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Partner Portal</p>
        </div>

        {/* Card */}
        <div className="card-elevated rounded-2xl p-6 shadow-xl">
          <AnimatePresence mode="wait">
            {step === "mobile" ? (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Sign In</h2>
                    <p className="text-xs text-muted-foreground">Enter your registered mobile</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Mobile Number</label>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 h-12 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <span className="text-sm font-medium text-muted-foreground border-r border-border pr-3">+91</span>
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
                      placeholder="10-digit number"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      autoFocus
                    />
                  </div>
                  {mobileError && <p className="text-xs text-destructive font-medium">{mobileError}</p>}
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || mobile.length !== 10}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold transition-all",
                    "purple-gradient text-primary-foreground shadow-md hover:opacity-90 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  )}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Send OTP <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>

                <p className="text-center text-[11px] text-muted-foreground">
                  Demo: any valid 10-digit number works
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Verify OTP</h2>
                    <p className="text-xs text-muted-foreground">
                      Sent to +91 {mobile.slice(0, 5)}*****
                    </p>
                  </div>
                </div>

                {/* OTP Boxes */}
                <div className="flex gap-3 justify-center">
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
                        "h-14 w-14 rounded-xl border-2 bg-background text-center text-xl font-bold text-foreground",
                        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                        digit ? "border-primary" : "border-border"
                      )}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-2.5 text-center">
                  <p className="text-xs text-primary font-medium">
                    Demo OTP: <span className="font-bold tracking-widest">{DUMMY_OTP}</span>
                  </p>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join("").length !== 4}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 rounded-xl h-12 text-sm font-semibold transition-all",
                    "purple-gradient text-primary-foreground shadow-md hover:opacity-90 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  )}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Verify & Login <ShieldCheck className="h-4 w-4" /></>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <button onClick={() => setStep("mobile")} className="hover:text-foreground transition-colors">
                    ← Change Number
                  </button>
                  <button onClick={handleResend} className="hover:text-primary transition-colors text-primary font-medium">
                    Resend OTP
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          © 2026 Happirate Fleet · Partner Portal
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
