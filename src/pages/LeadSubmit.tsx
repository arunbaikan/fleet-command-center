import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Share2, Copy, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { partnerProfile } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type Mode = "assisted" | "share";

const LeadSubmit = () => {
  const [mode, setMode] = useState<Mode>("assisted");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [income, setIncome] = useState("");
  const [pincode, setPincode] = useState("");
  const [employment, setEmployment] = useState("salaried");

  const handleSubmit = () => {
    if (!name || !mobile) {
      toast.error("Name and mobile are required");
      return;
    }
    if (step === 0) {
      if (mobile === "9999999999") {
        toast.error("Customer already has an active application.");
        return;
      }
      setStep(1);
      return;
    }
    setSubmitted(true);
    toast.success("Lead submitted successfully! 🎉");
  };

  const resetForm = () => {
    setName(""); setMobile(""); setIncome(""); setPincode(""); setEmployment("salaried");
    setStep(0); setSubmitted(false);
  };

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-secondary p-1.5 gap-1">
        {(["assisted", "share"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); resetForm(); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all",
              mode === m ? "gold-gradient text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "assisted" ? <UserPlus className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {m === "assisted" ? "Assisted Mode" : "Share Link"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "share" ? (
          <motion.div key="share" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card-elevated rounded-xl p-8 text-center space-y-5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald/10">
                <Share2 className="h-9 w-9 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Share Your Magic Link</h3>
                <p className="text-sm text-muted-foreground mt-1">Customer completes the application themselves. You get notified on each stage.</p>
              </div>
              <div className="rounded-xl bg-background px-4 py-3 text-sm text-muted-foreground font-mono border border-border break-all text-left">
                {partnerProfile.referralLink}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { navigator.clipboard.writeText(partnerProfile.referralLink); toast.success("Copied!"); }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-sm font-semibold text-foreground hover:bg-secondary/80 active:scale-[0.98] transition-all"
                >
                  <Copy className="h-4 w-4" /> Copy Link
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Apply for a personal loan here: ${partnerProfile.referralLink}`)}`, "_blank")}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Share2 className="h-4 w-4" /> WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="assisted" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-elevated rounded-xl p-10 text-center space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald/10 emerald-glow">
                  <CheckCircle2 className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Lead Submitted!</h3>
                <p className="text-sm text-muted-foreground">SMS link sent to customer. You'll be notified on each stage.</p>
                <button onClick={resetForm} className="gold-gradient rounded-xl px-8 py-3 text-sm font-bold text-primary-foreground active:scale-[0.98] transition-transform">
                  Submit Another Lead
                </button>
              </motion.div>
            ) : (
              <div className="card-elevated rounded-xl p-6 space-y-5">
                {/* Step Indicator */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", step >= 0 ? "gold-gradient text-primary-foreground" : "bg-secondary text-muted-foreground")}>1</div>
                    <span className={cn("text-xs font-medium", step === 0 ? "text-foreground" : "text-muted-foreground")}>Customer Info</span>
                  </div>
                  <div className={cn("h-px flex-1", step >= 1 ? "gold-gradient" : "bg-border")} />
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", step >= 1 ? "gold-gradient text-primary-foreground" : "bg-secondary text-muted-foreground")}>2</div>
                    <span className={cn("text-xs font-medium", step === 1 ? "text-foreground" : "text-muted-foreground")}>Eligibility</span>
                  </div>
                </div>

                {step === 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Customer Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Mobile Number</label>
                      <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile" maxLength={10} className={inputClass} />
                    </div>
                    <div className="col-span-2 flex items-start gap-2 rounded-xl bg-status-review/10 p-4">
                      <AlertCircle className="h-4 w-4 text-status-review mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">System will check for duplicate leads before proceeding. Try <code className="text-foreground">9999999999</code> to see the error.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Monthly Income (₹)</label>
                      <input value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g. 45000" type="number" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Pincode</label>
                      <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="e.g. 400001" maxLength={6} className={inputClass} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Employment Type</label>
                      <div className="flex gap-3">
                        {["salaried", "self-employed"].map((type) => (
                          <button key={type} onClick={() => setEmployment(type)} className={cn(
                            "flex-1 rounded-xl border py-3 text-sm font-semibold capitalize transition-all",
                            employment === type ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"
                          )}>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {step === 1 && (
                    <button onClick={() => setStep(0)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all">
                      ← Back
                    </button>
                  )}
                  <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 gold-gradient rounded-xl py-3 text-sm font-bold text-primary-foreground shadow-lg active:scale-[0.98] transition-transform">
                    <Send className="h-4 w-4" />
                    {step === 0 ? "Check & Continue" : "Submit Lead"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadSubmit;
