import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Share2, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { partnerProfile } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type Mode = "assisted" | "share";

const LeadSubmit = () => {
  const [mode, setMode] = useState<Mode>("assisted");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Form state
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
      // Simulate duplicate check
      if (mobile === "9999999999") {
        toast.error("Customer already has an active application.");
        return;
      }
      setStep(1);
      return;
    }
    // Simulate submission
    setSubmitted(true);
    toast.success("Lead submitted successfully! 🎉");
  };

  const resetForm = () => {
    setName("");
    setMobile("");
    setIncome("");
    setPincode("");
    setEmployment("salaried");
    setStep(0);
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">Submit New Lead</h2>

      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-secondary p-1 gap-1">
        {(["assisted", "share"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); resetForm(); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all",
              mode === m
                ? "gold-gradient text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "assisted" ? <UserPlus className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {m === "assisted" ? "Assisted" : "Share Link"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "share" ? (
          <motion.div
            key="share"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="card-elevated rounded-xl p-5 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10">
                <Share2 className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Share Your Magic Link</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Customer completes the application themselves. You get notified on completion.
                </p>
              </div>
              <div className="rounded-lg bg-background px-3 py-2.5 text-xs text-muted-foreground font-mono border border-border break-all">
                {partnerProfile.referralLink}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(partnerProfile.referralLink);
                    toast.success("Copied!");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-secondary py-3 text-sm font-semibold text-foreground transition-transform active:scale-[0.98]"
                >
                  <Copy className="h-4 w-4" /> Copy Link
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Apply for a personal loan here: ${partnerProfile.referralLink}`)}`, "_blank")}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald py-3 text-sm font-semibold text-accent-foreground transition-transform active:scale-[0.98]"
                >
                  <Share2 className="h-4 w-4" /> WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="assisted"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card-elevated rounded-xl p-6 text-center space-y-3"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 emerald-glow">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Lead Submitted!</h3>
                <p className="text-sm text-muted-foreground">
                  SMS link sent to customer. You'll be notified on each stage.
                </p>
                <button
                  onClick={resetForm}
                  className="gold-gradient rounded-lg px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <>
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  <div className={cn("h-1.5 flex-1 rounded-full", step >= 0 ? "gold-gradient" : "bg-secondary")} />
                  <div className={cn("h-1.5 flex-1 rounded-full", step >= 1 ? "gold-gradient" : "bg-secondary")} />
                </div>

                {step === 0 ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Customer Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Mobile Number</label>
                      <input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-status-review/10 p-3">
                      <AlertCircle className="h-4 w-4 text-status-review mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        System will check for duplicate leads before proceeding.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Monthly Income (₹)</label>
                      <input
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        placeholder="e.g. 45000"
                        type="number"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Pincode</label>
                      <input
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 400001"
                        maxLength={6}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Employment Type</label>
                      <div className="flex gap-2">
                        {["salaried", "self-employed"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setEmployment(type)}
                            className={cn(
                              "flex-1 rounded-lg border py-2.5 text-xs font-semibold capitalize transition-all",
                              employment === type
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-muted-foreground"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full gold-gradient rounded-xl py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] shadow-lg"
                >
                  {step === 0 ? "Check & Continue →" : "Submit Lead 🚀"}
                </button>

                {step === 1 && (
                  <button
                    onClick={() => setStep(0)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground text-center py-1"
                  >
                    ← Back
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadSubmit;
