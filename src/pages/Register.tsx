import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, ShieldCheck, ArrowRight, RefreshCw, Skull,
  User, Briefcase, Building2, CreditCard, BadgeCheck,
  ChevronLeft, CheckCircle2, Landmark, Smartphone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DUMMY_OTP = "1234";

// ── Types ──────────────────────────────────────────────────────────────────
type OnboardStep = "mobile" | "otp" | "personal" | "business" | "kyc" | "success";

interface PersonalForm { name: string; email: string; dob: string; city: string; state: string }
interface BusinessForm { businessName: string; businessType: string; gstNumber: string; experience: string; monthlyLeads: string }
interface KycForm { panNumber: string; aadhaarNumber: string; accountHolder: string; bankName: string; accountNumber: string; ifscCode: string; upiId: string }

const STEPS: { key: OnboardStep; label: string }[] = [
  { key: "mobile",   label: "Mobile" },
  { key: "personal", label: "Personal" },
  { key: "business", label: "Business" },
  { key: "kyc",      label: "KYC" },
];

const BUSINESS_TYPES = [
  "Individual / Freelancer",
  "Proprietorship",
  "Partnership Firm",
  "Private Limited Company",
  "DSA / Sub-DSA",
  "Insurance Agent",
  "Other",
];

const STATES = [
  "Andhra Pradesh","Assam","Bihar","Delhi","Gujarat","Haryana",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Punjab",
  "Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal",
];

// ── Helpers ────────────────────────────────────────────────────────────────
const validatePAN = (v: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.toUpperCase());
const validateIFSC = (v: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase());
const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ── Sub-components ─────────────────────────────────────────────────────────
const Field = ({
  label, value, onChange, placeholder, type = "text", maxLength, error, hint, required, pattern,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; maxLength?: number; error?: string; hint?: string; required?: boolean; pattern?: string;
}) => (
  <div className="space-y-1.5 mb-1">
    <label className="text-sm font-medium text-foreground flex gap-1">
      {label}{required && <span className="text-destructive">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      pattern={pattern}
      className={cn(
        "w-full rounded-xl border bg-background px-3 h-11 text-sm text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
        error ? "border-destructive focus:ring-destructive/20" : "border-border focus:border-primary"
      )}
    />
    {hint && !error && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    {error && <p className="text-[11px] text-destructive font-medium mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label, value, onChange, options, placeholder, required, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; required?: boolean; error?: string;
}) => (
  <div className="space-y-1.5 mb-1">
    <label className="text-sm font-medium text-foreground flex gap-1">
      {label}{required && <span className="text-destructive">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-xl border bg-background px-3 h-11 text-sm text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none",
        error ? "border-destructive" : "border-border focus:border-primary",
        !value && "text-muted-foreground"
      )}
    >
      <option value="" disabled>{placeholder || "Select..."}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    {error && <p className="text-[11px] text-destructive font-medium mt-1">{error}</p>}
  </div>
);

// ── Step Progress Bar ──────────────────────────────────────────────────────
const StepBar = ({ currentStep }: { currentStep: OnboardStep }) => {
  const stepKeys = STEPS.map((s) => s.key);
  const activeIdx = stepKeys.indexOf(currentStep === "otp" ? "mobile" : currentStep);

  return (
    <div className="flex items-center gap-1 mb-8 mt-2">
      {STEPS.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={s.key} className="flex items-center gap-1 flex-1 last:flex-none">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all shrink-0",
              done  ? "bg-primary text-primary-foreground"  :
              active ? "border-2 border-primary text-primary bg-primary/10" :
                       "border border-border text-muted-foreground bg-background"
            )}>
              {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm md:text-base font-semibold hidden sm:block",
                active
                  ? "text-primary"
                  : done
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-px mx-1 transition-all",
                done ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<OnboardStep>("mobile");
  const [loading, setLoading] = useState(false);

  // Step 1 – Mobile
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  // Step 2 – Personal
  const [personal, setPersonal] = useState<PersonalForm>({ name: "", email: "", dob: "", city: "", state: "" });
  const [personalErrors, setPersonalErrors] = useState<Partial<PersonalForm>>({});

  // Step 3 – Business
  const [business, setBusiness] = useState<BusinessForm>({
    businessName: "", businessType: "", gstNumber: "", experience: "", monthlyLeads: "",
  });
  const [businessErrors, setBusinessErrors] = useState<Partial<BusinessForm>>({});

  // Step 4 – KYC
  const [kyc, setKyc] = useState<KycForm>({
    panNumber: "", aadhaarNumber: "", accountHolder: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",
  });
  const [kycErrors, setKycErrors] = useState<Partial<KycForm>>({});
  const [kycMethod, setKycMethod] = useState<"bank" | "upi">("bank");

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("otp");
    toast.success("OTP sent!", { description: `Demo OTP: ${DUMMY_OTP}` });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 3) document.getElementById(`reg-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`reg-otp-${index - 1}`)?.focus();
  };

  const handleVerifyOtp = async () => {
    if (otp.join("").length !== 4) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (otp.join("") === DUMMY_OTP) {
      setLoading(false);
      setStep("personal");
    } else {
      setLoading(false);
      toast.error("Incorrect OTP", { description: `Use ${DUMMY_OTP}` });
      setOtp(["", "", "", ""]);
      document.getElementById("reg-otp-0")?.focus();
    }
  };

  const handlePersonalNext = () => {
    const errors: Partial<PersonalForm> = {};
    if (!personal.name.trim()) errors.name = "Full name is required";
    if (!personal.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(personal.email)) errors.email = "Enter a valid email";
    if (!personal.dob) errors.dob = "Date of birth is required";
    if (!personal.city.trim()) errors.city = "City is required";
    if (!personal.state) errors.state = "State is required";
    setPersonalErrors(errors);
    if (Object.keys(errors).length === 0) setStep("business");
  };

  const handleBusinessNext = () => {
    const errors: Partial<BusinessForm> = {};
    if (!business.businessName.trim()) errors.businessName = "Business name is required";
    if (!business.businessType) errors.businessType = "Select business type";
    if (!business.experience) errors.experience = "Select experience";
    setBusinessErrors(errors);
    if (Object.keys(errors).length === 0) setStep("kyc");
  };

  const handleKycSubmit = async () => {
    const errors: Partial<KycForm> = {};
    if (!kyc.panNumber.trim()) errors.panNumber = "PAN number is required";
    else if (!validatePAN(kyc.panNumber)) errors.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
    if (!kyc.aadhaarNumber.trim()) errors.aadhaarNumber = "Aadhaar number is required";
    else if (!/^\d{12}$/.test(kyc.aadhaarNumber.replace(/\s/g, ""))) errors.aadhaarNumber = "Enter valid 12-digit Aadhaar";

    if (kycMethod === "bank") {
      if (!kyc.accountHolder.trim()) errors.accountHolder = "Account holder name required";
      if (!kyc.bankName.trim()) errors.bankName = "Bank name is required";
      if (!kyc.accountNumber.trim()) errors.accountNumber = "Account number is required";
      else if (!/^\d{9,18}$/.test(kyc.accountNumber)) errors.accountNumber = "Enter valid account number (9–18 digits)";
      if (!kyc.ifscCode.trim()) errors.ifscCode = "IFSC code is required";
      else if (!validateIFSC(kyc.ifscCode)) errors.ifscCode = "Invalid IFSC format (e.g. HDFC0001234)";
    } else {
      if (!kyc.upiId.trim()) errors.upiId = "UPI ID is required";
      else if (!kyc.upiId.includes("@")) errors.upiId = "Enter valid UPI ID (e.g. name@upi)";
    }

    setKycErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
  };

  const handleGoToDashboard = () => {
    login(mobile);
    toast.success("Welcome to Happirate Fleet! 🎉");
    navigate("/");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-14">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md md:max-w-lg lg:max-w-2xl"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl purple-gradient shadow-lg mb-4">
            <Skull className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Happirate <span className="purple-text">Fleet</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">New Partner Registration</p>
        </div>

        {/* Card */}
        <div className="card-elevated rounded-2xl px-6 py-8 shadow-xl md:px-10 md:py-10">
          {/* Step bar (not on success) */}
          {step !== "success" && <StepBar currentStep={step} />}

          <AnimatePresence mode="wait">

            {/* ── STEP: Mobile ─────────────────────────── */}
            {step === "mobile" && (
              <motion.div key="mobile" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Verify Mobile</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">We'll send an OTP to confirm</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Mobile Number <span className="text-destructive">*</span></label>
                  <div className={cn(
                    "flex items-center gap-2 rounded-xl border bg-background px-3 h-11 transition-all",
                    "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
                    mobileError ? "border-destructive" : "border-border"
                  )}>
                    <span className="text-sm font-medium text-muted-foreground border-r border-border pr-3">+91</span>
                    <input
                      type="tel" inputMode="numeric" maxLength={10} value={mobile} autoFocus
                      onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setMobileError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      placeholder="10-digit number"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                  {mobileError && <p className="text-[11px] text-destructive font-medium mt-1">{mobileError}</p>}
                </div>

                <button
                  onClick={handleSendOtp} disabled={loading || mobile.length !== 10}
                  className="w-full flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold purple-gradient text-primary-foreground shadow hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><span>Send OTP</span><ArrowRight className="h-4 w-4" /></>}
                </button>
              </motion.div>
            )}

            {/* ── STEP: OTP ────────────────────────────── */}
            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Enter OTP</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Sent to +91 {mobile.slice(0,5)}*****</p>
                  </div>
                </div>

                {/* OTP boxes */}
                <div className="flex gap-3 justify-center my-4">
                  {otp.map((digit, i) => (
                    <input key={i} id={`reg-otp-${i}`} type="tel" inputMode="numeric" maxLength={1} value={digit} autoFocus={i === 0}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={cn(
                        "h-14 w-14 rounded-xl border-2 bg-background text-center text-xl font-bold text-foreground transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        digit ? "border-primary" : "border-border"
                      )}
                    />
                  ))}
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-center my-2">
                  <p className="text-xs text-primary font-medium">Demo OTP: <span className="font-bold tracking-widest">{DUMMY_OTP}</span></p>
                </div>

                <button
                  onClick={handleVerifyOtp} disabled={loading || otp.join("").length !== 4}
                  className="w-full flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold purple-gradient text-primary-foreground shadow hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><span>Verify & Continue</span><ArrowRight className="h-4 w-4" /></>}
                </button>

                <button onClick={() => setStep("mobile")} className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 transition-colors mt-3">
                  <ChevronLeft className="h-3 w-3" /> Change Number
                </button>
              </motion.div>
            )}

            {/* ── STEP: Personal ───────────────────────── */}
            {step === "personal" && (
              <motion.div key="personal" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Personal Details</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Tell us about yourself</p>
                  </div>
                </div>

                <Field label="Full Name" value={personal.name} onChange={(v) => setPersonal({ ...personal, name: v })}
                  placeholder="As per PAN card" required error={personalErrors.name} maxLength={100} />
                <Field label="Email Address" value={personal.email} onChange={(v) => setPersonal({ ...personal, email: v })}
                  type="email" placeholder="you@example.com" required error={personalErrors.email} />
                <Field label="Date of Birth" value={personal.dob} onChange={(v) => setPersonal({ ...personal, dob: v })}
                  type="date" required error={personalErrors.dob} />
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <Field label="City" value={personal.city} onChange={(v) => setPersonal({ ...personal, city: v })}
                    placeholder="Your city" required error={personalErrors.city} maxLength={60} />
                  <SelectField label="State" value={personal.state} onChange={(v) => setPersonal({ ...personal, state: v })}
                    options={STATES} placeholder="Select state" required error={personalErrors.state} />
                </div>

                <button onClick={handlePersonalNext}
                  className="w-full flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold purple-gradient text-primary-foreground shadow hover:opacity-90 active:scale-95 transition-all mt-4"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {/* ── STEP: Business ───────────────────────── */}
            {step === "business" && (
              <motion.div key="business" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Business Details</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Help lenders know your business</p>
                  </div>
                </div>

                <Field label="Business / Agency Name" value={business.businessName}
                  onChange={(v) => setBusiness({ ...business, businessName: v })}
                  placeholder="e.g. Mehta Financial Services" required error={businessErrors.businessName} maxLength={100} />
                <SelectField label="Business Type" value={business.businessType}
                  onChange={(v) => setBusiness({ ...business, businessType: v })}
                  options={BUSINESS_TYPES} placeholder="Select type" required error={businessErrors.businessType} />

                <Field label="GST Number" value={business.gstNumber}
                  onChange={(v) => setBusiness({ ...business, gstNumber: v.toUpperCase() })}
                  placeholder="22ABCDE1234F1Z5 (optional)" hint="Leave blank if not registered"
                  maxLength={15} />

                <div className="grid grid-cols-2 gap-4 mt-1">
                  <SelectField label="Experience" value={business.experience}
                    onChange={(v) => setBusiness({ ...business, experience: v })}
                    options={["< 1 Year", "1–3 Years", "3–5 Years", "5–10 Years", "10+ Years"]}
                    placeholder="Select" required error={businessErrors.experience} />
                  <SelectField label="Monthly Leads Est." value={business.monthlyLeads}
                    onChange={(v) => setBusiness({ ...business, monthlyLeads: v })}
                    options={["1–10", "10–30", "30–50", "50–100", "100+"]}
                    placeholder="Select" />
                </div>

                <div className="flex gap-3 mt-4 pt-2">
                  <button onClick={() => setStep("personal")}
                    className="flex items-center gap-1 rounded-xl border border-border px-4 h-11 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={handleBusinessNext}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold purple-gradient text-primary-foreground shadow hover:opacity-90 active:scale-95 transition-all"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP: KYC ────────────────────────────── */}
            {step === "kyc" && (
              <motion.div key="kyc" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">KYC & Payout Setup</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Required for commission payouts</p>
                  </div>
                </div>

                {/* Identity */}
                <div className="rounded-xl border border-border px-4 py-5 space-y-4 bg-secondary/30">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <CreditCard className="h-3.5 w-3.5" /> Identity Verification
                  </p>
                  <Field label="PAN Number" value={kyc.panNumber}
                    onChange={(v) => setKyc({ ...kyc, panNumber: v.toUpperCase() })}
                    placeholder="ABCDE1234F" required error={kycErrors.panNumber}
                    maxLength={10} hint="Must match your registered name" />
                  <Field label="Aadhaar Number" value={kyc.aadhaarNumber}
                    onChange={(v) => setKyc({ ...kyc, aadhaarNumber: v.replace(/\D/g, "") })}
                    placeholder="12-digit Aadhaar number" required error={kycErrors.aadhaarNumber}
                    maxLength={12} hint="Last 4 digits will be masked for security" />
                </div>

                {/* Payout Method Toggle */}
                <div className="rounded-xl border border-border px-4 py-5 space-y-4 bg-secondary/30">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Landmark className="h-3.5 w-3.5" /> Payout Method
                  </p>
                  <div className="flex rounded-xl border border-border overflow-hidden mb-3">
                    {[
                      { key: "bank", label: "Bank Account", icon: Building2 },
                      { key: "upi",  label: "UPI ID",       icon: Smartphone },
                    ].map(({ key, label, icon: Icon }) => (
                      <button key={key} onClick={() => setKycMethod(key as "bank" | "upi")}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all",
                          kycMethod === key
                            ? "purple-gradient text-primary-foreground"
                            : "bg-background text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    ))}
                  </div>

                  {kycMethod === "bank" ? (
                    <div className="space-y-4">
                      <Field label="Account Holder Name" value={kyc.accountHolder}
                        onChange={(v) => setKyc({ ...kyc, accountHolder: v })}
                        placeholder="As per bank records" required error={kycErrors.accountHolder} />
                      <Field label="Bank Name" value={kyc.bankName}
                        onChange={(v) => setKyc({ ...kyc, bankName: v })}
                        placeholder="e.g. HDFC Bank" required error={kycErrors.bankName} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Account Number" value={kyc.accountNumber}
                          onChange={(v) => setKyc({ ...kyc, accountNumber: v.replace(/\D/g, "") })}
                          placeholder="9–18 digits" required error={kycErrors.accountNumber} maxLength={18} />
                        <Field label="IFSC Code" value={kyc.ifscCode}
                          onChange={(v) => setKyc({ ...kyc, ifscCode: v.toUpperCase() })}
                          placeholder="HDFC0001234" required error={kycErrors.ifscCode} maxLength={11} />
                      </div>
                    </div>
                  ) : (
                    <Field label="UPI ID" value={kyc.upiId}
                      onChange={(v) => setKyc({ ...kyc, upiId: v })}
                      placeholder="yourname@upi" required error={kycErrors.upiId} />
                  )}
                </div>

                <p className="text-[10px] text-muted-foreground text-center my-2">
                  🔒 Your data is encrypted and used only for KYC & payouts
                </p>

                <div className="flex gap-3 mt-2 pt-1">
                  <button onClick={() => setStep("business")}
                    className="flex items-center gap-1 rounded-xl border border-border px-4 h-11 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={handleKycSubmit} disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold purple-gradient text-primary-foreground shadow hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><BadgeCheck className="h-4 w-4" /> Submit & Register</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP: Success ─────────────────────────── */}
            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-6">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full purple-gradient shadow-lg mx-auto mb-4"
                >
                  <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-foreground">Registration Complete!</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Welcome, <span className="font-semibold text-foreground">{personal.name}</span>!<br />
                    Your partner account is under review.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 px-5 py-4 text-left space-y-3 my-2">
                  {[
                    { icon: Phone, label: "Mobile", value: `+91 ${mobile}` },
                    { icon: Briefcase, label: "Business", value: business.businessName },
                    { icon: CreditCard, label: "PAN", value: `${kyc.panNumber.slice(0,5)}*****` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground w-16">{label}</span>
                      <span className="text-xs font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={handleGoToDashboard}
                  className="w-full flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold purple-gradient text-primary-foreground shadow hover:opacity-90 active:scale-95 transition-all mt-2"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Link to Login */}
        {step !== "success" && (
          <p className="text-center text-md text-muted-foreground mt-6">
            Already a partner?{" "}
            <button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">
              Sign In
            </button>
          </p>
        )}
        <p className="text-center text-md text-muted-foreground mt-4 mb-2">
          © 2026 Happirate Fleet · Partner Portal
        </p>
      </motion.div>
    </div>
  );
};

export default Register;