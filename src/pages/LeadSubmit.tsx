import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, Share2, Copy, CheckCircle2, AlertCircle, Send, 
  ArrowLeft, ArrowRight, User, MapPin, Briefcase, CreditCard, 
  IndianRupee, Phone, Mail, Calendar, Building, Home, FileText
} from "lucide-react";
import { toast } from "sonner";
import { partnerProfile } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import StepIndicator from "@/components/StepIndicator";
import FormCard from "@/components/FormCard";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FileUploadZone from "@/components/FileUploadZone";
import { fetchCreditReport, updateCreditReport } from "@/api/api";

type Mode = "assisted" | "share";

const steps = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Employment & Credit" },
  { id: 3, title: "Loan & Documents" },
  { id: 4, title: "Review & Submit" },
];

const loanTypes = [
  { value: "personal", label: "Personal Loan" },
  { value: "home", label: "Home Loan" },
  { value: "education", label: "Education Loan" },
  { value: "vehicle", label: "Vehicle Loan" },
  { value: "business", label: "Business Loan" },
];

const employmentStatuses = [
  { value: "salaried", label: "Salaried" },
  { value: "self-employed", label: "Self Employed" },
  { value: "business", label: "Business Owner" },
  { value: "retired", label: "Retired" },
];

const residentialStatuses = [
  { value: "owned", label: "Owned" },
  { value: "rented", label: "Rented" },
  { value: "family", label: "Living with Family" },
];

const LeadSubmit = () => {
  const [mode, setMode] = useState<Mode>("assisted");
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailOptions, setEmailOptions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    panCard: "",
    email: "",
    aadhaarCard: "",
    mobileNumber: "",
    uanNumber: "",
    employmentExperience: "",
    employmentStatus: "",
    companyName: "",
    monthlyIncome: "",
    residentialStatus: "",
    addressLine1: "",
    state: "",
    pincode: "",
    loanType: "",
    loanAmount: "",
    cibilScore: "",
    recentEnquiries: "",
    settlements: "",
    emiBounces: "",
    creditCardUtilization: "",
    residentialStability: "",
    existingEmi: "",
    loanTenure: "",
    employmentCategory: "",
    salaryMode: "",
  });

  const [documents, setDocuments] = useState({
    itr: null,
    photo: null,
    payslip1: null,
    payslip2: null,
    payslip3: null,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const validatePan = (value: string) => {
    if (!value) return "PAN is required";
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(value.toUpperCase()) ? null : "Invalid PAN format (e.g. ABCDE1234F)";
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "DOB is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.addressLine1) newErrors.addressLine1 = "Address is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pincode) newErrors.pincode = "Pincode is required";
      if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
      
      const panErr = validatePan(formData.panCard);
      if (panErr) newErrors.panCard = panErr;
    }

    if (currentStep === 1) {
      if (!formData.employmentStatus) newErrors.employmentStatus = "Employment Status is Required";
      if (!formData.companyName) newErrors.companyName = "Company Name is Required";
      if (!formData.monthlyIncome) newErrors.monthlyIncome = "Monthly Income is Required";
      if (!formData.cibilScore) newErrors.cibilScore = "CIBIL Score is Required";
      if (!formData.employmentCategory) newErrors.employmentCategory = "Category is required";
      if (!formData.salaryMode) newErrors.salaryMode = "Salary mode is required";
    }

    if (currentStep === 2) {
      if (!formData.loanType) newErrors.loanType = "Loan Type is Required";
      if (!formData.loanAmount) newErrors.loanAmount = "Loan Amount is Required";
      if (!formData.loanTenure) newErrors.loanTenure = "Tenure is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      if (currentStep < 3) {
        await updateCreditReport(formData);
        setCurrentStep(currentStep + 1);
      } else {
        if (!termsAccepted || !privacyAccepted) {
          toast.error("Please accept Terms & Privacy Policy");
          return;
        }
        setSubmitted(true);
        toast.success("Lead submitted successfully! 🎉");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setSubmitted(false);
    setFormData({
      firstName: "", lastName: "", middleName: "", dateOfBirth: "", panCard: "",
      email: "", aadhaarCard: "", mobileNumber: "", uanNumber: "", employmentExperience: "",
      employmentStatus: "", companyName: "", monthlyIncome: "", residentialStatus: "",
      addressLine1: "", state: "", pincode: "", loanType: "", loanAmount: "",
      cibilScore: "", recentEnquiries: "", settlements: "", emiBounces: "",
      creditCardUtilization: "", residentialStability: "", existingEmi: "",
      loanTenure: "", employmentCategory: "", salaryMode: "",
    });
  };

  const autoFillUserDetails = useCallback(async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length < 10) return;
    
    setIsLoading(true);
    try {
      const resp = await fetchCreditReport({ mobileNumber: formData.mobileNumber });
      const apiData = resp.data.data;
      
      const emails = apiData.emails.map((e: any) => e.email);
      setEmailOptions(emails);

      setFormData(prev => ({
        ...prev,
        firstName: apiData.firstName || "",
        lastName: apiData.lastName || "",
        middleName: apiData.middleName || "",
        dateOfBirth: apiData.dateOfBirth ? apiData.dateOfBirth.split("T")[0] : "",
        panCard: apiData.panCard || "",
        email: emails[0] || "",
        uanNumber: apiData.uanNumber || "",
        employmentStatus: apiData.employmentStatus || "",
        companyName: apiData.companyName || "",
        monthlyIncome: apiData.monthlyIncome?.toString() || "",
        addressLine1: apiData.addresses[0]?.streetAddress || "",
        state: apiData.addresses[0]?.state || "",
        pincode: apiData.addresses[0]?.pincode || "",
        cibilScore: apiData.cibilScore?.toString() || "",
        recentEnquiries: apiData.last6MonthsEnquiryCount?.toString() || "",
        settlements: apiData.settlements?.toString() || "",
        emiBounces: apiData.emiBounces?.toString() || "",
        creditCardUtilization: apiData.creaditCardUtilization?.toString() || "",
        existingEmi: apiData.existingEmi?.toString() || "",
        loanTenure: apiData.loanTenure?.toString() || "",
        salaryMode: apiData.salaryMode || "",
        employmentCategory: apiData.employmentCategory || "",
      }));
      toast.success("Details auto-filled from credit report!");
    } catch (error) {
      console.error("Auto-fill failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData.mobileNumber]);

  const SummarySection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-primary/10 to-accent/30 px-5 py-3 border-b border-border/50">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </h3>
      </div>
      <div className="p-5 space-y-2">{children}</div>
    </div>
  );

  const SummaryRow = ({ label, value, icon: Icon, highlighted }: { label: string, value: string, icon?: any, highlighted?: boolean }) => (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground text-xs flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-primary/60" />}
        {label}
      </span>
      <span className={cn(
        "text-xs font-medium text-right",
        highlighted ? "text-primary font-semibold" : "text-foreground"
      )}>
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <Share2 className="h-9 w-9 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Share Your Magic Link</h3>
                <p className="text-sm text-muted-foreground mt-1">Customer completes the application themselves. You get notified on each stage.</p>
              </div>
              <div className="rounded-xl bg-background px-4 py-3 text-sm text-muted-foreground font-mono border border-border break-all text-left">
                {partnerProfile.referralLink}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1 h-12" onClick={() => { navigator.clipboard.writeText(partnerProfile.referralLink); toast.success("Copied!"); }}>
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
                <Button className="flex-1 h-12 gold-gradient" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Apply for a personal loan here: ${partnerProfile.referralLink}`)}`, "_blank")}>
                  <Share2 className="h-4 w-4 mr-2" /> WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="assisted" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-elevated rounded-xl p-10 text-center space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 violet-glow">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Lead Submitted!</h3>
                <p className="text-sm text-muted-foreground">SMS link sent to customer. You'll be notified on each stage.</p>
                <Button onClick={resetForm} className="gold-gradient h-12 px-8">
                  Submit Another Lead
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {isLoading && currentStep === 0 && formData.mobileNumber.length >= 10 && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 w-full max-w-xs px-6">
                      <p className="text-lg font-bold text-foreground animate-pulse">
                        Fetching <span className="text-primary">credit profile...</span>
                      </p>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <StepIndicator steps={steps} currentStep={currentStep + 1} />

                {currentStep === 0 && (
                  <FormCard title="Personal Details" subtitle="Enter customer's basic information.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormInput label="Mobile Number" value={formData.mobileNumber} onChange={(v) => updateFormData("mobileNumber", v)} required error={errors.mobileNumber} onBlur={autoFillUserDetails} />
                      <FormInput label="First Name" value={formData.firstName} onChange={(v) => updateFormData("firstName", v)} required error={errors.firstName} />
                      <FormInput label="Middle Name" value={formData.middleName} onChange={(v) => updateFormData("middleName", v)} />
                      <FormInput label="Last Name" value={formData.lastName} onChange={(v) => updateFormData("lastName", v)} required error={errors.lastName} />
                      <FormInput label="Date of Birth" value={formData.dateOfBirth} onChange={(v) => updateFormData("dateOfBirth", v)} type="date" required error={errors.dateOfBirth} />
                      <FormInput label="PAN Card" value={formData.panCard} onChange={(v) => updateFormData("panCard", v)} required error={errors.panCard} placeholder="ABCDE1234F" />
                      {emailOptions.length > 1 ? (
                        <FormSelect label="Email" value={formData.email} onChange={(v) => updateFormData("email", v)} options={emailOptions.map(e => ({ value: e, label: e }))} required error={errors.email} />
                      ) : (
                        <FormInput label="Email" value={formData.email} onChange={(v) => updateFormData("email", v)} required error={errors.email} />
                      )}
                      <FormInput label="Address Line 1" value={formData.addressLine1} onChange={(v) => updateFormData("addressLine1", v)} required error={errors.addressLine1} />
                      <FormInput label="State" value={formData.state} onChange={(v) => updateFormData("state", v)} required error={errors.state} />
                      <FormInput label="Pincode" value={formData.pincode} onChange={(v) => updateFormData("pincode", v)} required error={errors.pincode} />
                    </div>
                  </FormCard>
                )}

                {currentStep === 1 && (
                  <FormCard title="Employment & Credit" subtitle="Review employment and credit details.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormSelect label="Employment Status" value={formData.employmentStatus} onChange={(v) => updateFormData("employmentStatus", v)} options={employmentStatuses} required error={errors.employmentStatus} />
                      <FormInput label="Company Name" value={formData.companyName} onChange={(v) => updateFormData("companyName", v)} required error={errors.companyName} />
                      <FormInput label="Employment Category" value={formData.employmentCategory} onChange={(v) => updateFormData("employmentCategory", v)} required error={errors.employmentCategory} placeholder="e.g. Category A" />
                      <FormInput label="Monthly Income (₹)" value={formData.monthlyIncome} onChange={(v) => updateFormData("monthlyIncome", v)} type="number" required error={errors.monthlyIncome} />
                      <FormSelect label="Salary Mode" value={formData.salaryMode} onChange={(v) => updateFormData("salaryMode", v)} options={[{value: "bank_transfer", label: "Bank Transfer"}, {value: "cash", label: "Cash"}]} required error={errors.salaryMode} />
                      <FormInput label="CIBIL Score" value={formData.cibilScore} onChange={(v) => updateFormData("cibilScore", v)} required error={errors.cibilScore} />
                      <FormInput label="UAN / PF Number" value={formData.uanNumber} onChange={(v) => updateFormData("uanNumber", v)} />
                      <FormInput label="Existing EMI (₹)" value={formData.existingEmi} onChange={(v) => updateFormData("existingEmi", v)} type="number" />
                    </div>
                  </FormCard>
                )}

                {currentStep === 2 && (
                  <FormCard title="Loan & Documents" subtitle="Select loan type and upload documents.">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                      <FormSelect label="Loan Type" value={formData.loanType} onChange={(v) => updateFormData("loanType", v)} options={loanTypes} required error={errors.loanType} />
                      <FormInput label="Loan Amount (₹)" value={formData.loanAmount} onChange={(v) => updateFormData("loanAmount", v)} type="number" required error={errors.loanAmount} />
                      <FormInput label="Tenure (Months)" value={formData.loanTenure} onChange={(v) => updateFormData("loanTenure", v)} type="number" required error={errors.loanTenure} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FileUploadZone label="Applicant Photo" onFileSelect={(f) => setDocuments(d => ({ ...d, photo: f }))} required />
                      <FileUploadZone label="Last 3 Months Payslips" onFileSelect={(f) => setDocuments(d => ({ ...d, payslip1: f }))} required />
                    </div>
                  </FormCard>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Header Summary Card */}
                    <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-primary-foreground shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-primary-foreground/80 text-xs font-medium mb-1 uppercase tracking-wider">Application Summary</p>
                          <h2 className="text-2xl font-bold">{formData.firstName} {formData.middleName} {formData.lastName}</h2>
                          <p className="text-primary-foreground/80 text-sm mt-1">{formData.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary-foreground/80 text-xs font-medium mb-1 uppercase tracking-wider">Requested Amount</p>
                          <p className="text-3xl font-bold">₹{Number(formData.loanAmount).toLocaleString("en-IN")}</p>
                          <p className="text-primary-foreground/80 text-sm mt-1">{loanTypes.find(l => l.value === formData.loanType)?.label}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SummarySection title="Personal Details" icon={User}>
                        <SummaryRow label="Full Name" value={`${formData.firstName} ${formData.middleName} ${formData.lastName}`} icon={User} />
                        <SummaryRow label="Mobile" value={formData.mobileNumber} icon={Phone} />
                        <SummaryRow label="Email" value={formData.email} icon={Mail} />
                        <SummaryRow label="PAN" value={formData.panCard} icon={CreditCard} highlighted />
                      </SummarySection>
                      <SummarySection title="Employment" icon={Briefcase}>
                        <SummaryRow label="Status" value={formData.employmentStatus} icon={Briefcase} />
                        <SummaryRow label="Company" value={formData.companyName} icon={Building} />
                        <SummaryRow label="Income" value={`₹${Number(formData.monthlyIncome).toLocaleString("en-IN")}`} icon={IndianRupee} highlighted />
                        <SummaryRow label="Category" value={formData.employmentCategory} />
                      </SummarySection>
                    </div>

                    <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm space-y-4">
                      <h3 className="text-base font-semibold text-foreground">Terms & Consent</h3>
                      <div className="flex items-start space-x-3 p-3 rounded-md border border-border">
                        <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(!!c)} />
                        <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                          I hereby declare that all the information provided is true and accurate. I authorize the bank to verify my details.
                        </label>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-md border border-border">
                        <Checkbox id="privacy" checked={privacyAccepted} onCheckedChange={(c) => setPrivacyAccepted(!!c)} />
                        <label htmlFor="privacy" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                          I agree to the Terms of Service and Privacy Policy.
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isLoading} className="h-12 px-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={handleNext} disabled={isLoading} className="h-12 px-8 gold-gradient">
                    {isLoading ? "Processing..." : currentStep === 3 ? "Submit Application" : "Next"}
                    {!isLoading && currentStep < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
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