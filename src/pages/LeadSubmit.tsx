import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  MapPin,
  Send,
  CreditCard,
  IndianRupee,
  Phone,
  Mail,
  Calendar,
  Building,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import StepIndicator from "@/components/StepIndicator";
import FormCard from "@/components/FormCard";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FileUploadZone from "@/components/FileUploadZone";
import { cn } from "@/lib/utils";
import {
  fetchCreditReport,
  updateCreditReport,
} from "@/api/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loader from "@/components/Loader";

const steps = [
  { id: 1, title: "Review & Edit Personal Details" },
  { id: 2, title: "Review & Edit Employment and Credit Details" },
  { id: 3, title: "Select Loan & Upload Documents" },
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

const getTodayISODate = () => {
  return new Date().toISOString().split("T")[0];
};

const validatePan = (value: string) => {
  if (!value) return "PAN is required";
  const pan = value.toUpperCase();
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(pan) ? null : "PAN must be in format ABCDE1234F";
};

const buildPersonalDetailsPayload = (data: any) => ({
  mobileNumber: sessionStorage.getItem("mobile_number"),
  firstName: data.firstName,
  lastName: data.lastName,
  middleName: data.middleName,
  dateOfBirth: data.dateOfBirth,
  email: data.email,
  panCard: data.panCard,
  addressLine1: data.addressLine1,
  state: data.state,
  pincode: data.pincode,
});

const buildEmploymentDetailsPayload = (data: any) => ({
  mobileNumber: sessionStorage.getItem("mobile_number"),
  employmentStatus: data.employmentStatus,
  companyName: data.companyName,
  uanNumber: data.uanNumber,
  employmentExperience: data.employmentExperience,
  monthlyIncome: Number(data.monthlyIncome),
  cibilScore: Number(data.cibilScore),
  recentEnquiries: Number(data.recentEnquiries),
  settlements: Number(data.settlements),
  emiBounces: Number(data.emiBounces),
  creditCardUtilization: Number(data.creditCardUtilization),
  existingEmi: Number(data.existingEmi),
  employmentCategory: data.employmentCategory,
  salaryMode: data.salaryMode,
});

const LoanApplication = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [emailOptions, setEmailOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
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

  const isEmpty = (v: any) => v === "" || v === null || v === undefined;

  const validateStep = () => {
    const newErrors: any = {};

    if (currentStep === 0) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "DOB is required";
      } else {
        const today = getTodayISODate();
        if (formData.dateOfBirth > today) {
          newErrors.dateOfBirth = "Date of birth cannot be in the future";
        }
      }
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.addressLine1) newErrors.addressLine1 = "Address is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pincode) newErrors.pincode = "Pincode is required";
      if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    }

    if (currentStep === 1) {
      if (!formData.employmentStatus || formData.employmentStatus.trim() === "")
        newErrors.employmentStatus = "Employment Status is Required";
      if (!formData.companyName) newErrors.companyName = "Company Name is Required";
      if (!formData.monthlyIncome) newErrors.monthlyIncome = "Monthly Income is Required";
      if (!formData.employmentCategory) newErrors.employmentCategory = "Employment Category is required";
      if (!formData.cibilScore) newErrors.cibilScore = "CIBIL Score is Required";
      if (!formData.employmentExperience) {
        newErrors.employmentExperience = "Employment Experience is Required";
      } else if (!/^\d+(\.\d+)?$/.test(formData.employmentExperience)) {
        newErrors.employmentExperience = "Only numbers allowed (e.g. 1 or 1.5)";
      }
      if (!formData.uanNumber) newErrors.uanNumber = "UAN/PF Number is required";
      if (!formData.salaryMode) newErrors.salaryMode = "Salary Mode is required";
      if (!formData.recentEnquiries && formData.recentEnquiries !== 0)
        newErrors.recentEnquiries = "Recent Enquiries is Required";
      if (isEmpty(formData.emiBounces)) newErrors.emiBounces = "EMI Bounces is required";
      if (!formData.creditCardUtilization && formData.creditCardUtilization !== 0)
        newErrors.creditCardUtilization = "Credit Card Utilization is required";
      if (!formData.residentialStability && formData.residentialStability !== 0)
        newErrors.residentialStability = "Residential Stability is required";
      if (!formData.existingEmi && formData.existingEmi !== 0)
        newErrors.existingEmi = "Existing EMI is required";
      if (!formData.settlements && formData.settlements !== 0)
        newErrors.settlements = "Settlements is required";
    }

    if (currentStep === 2) {
      if (!formData.loanType) newErrors.loanType = "Loan Type is Required";
      if (!formData.loanAmount) newErrors.loanAmount = "Loan Amount is Required";
      if (!formData.loanTenure) newErrors.loanTenure = "Loan Tenure Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [documents, setDocuments] = useState<any>({
    itr: null,
    photo: null,
    payslip1: null,
    payslip2: null,
    payslip3: null,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const handleNext = async () => {
    if (currentStep === 3 && (!termsAccepted || !privacyAccepted)) {
      setConsentError(true);
      toast.error("Please accept Terms & Privacy Policy");
      return;
    } else {
      setConsentError(false);
    }
    if (!validateStep()) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsLoading(true);

    if (currentStep === 0) {
      const panError = validatePan(formData.panCard);
      if (panError) {
        toast.error(panError);
        setIsLoading(false);
        return;
      }
      const payload = buildPersonalDetailsPayload(formData);
      try {
        await updateCreditReport(payload);
        toast.success("Personal details Submitted Successfully");
        setCurrentStep(1);
      } catch (error: any) {
        toast.error("Personal details submission failed");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (currentStep === 1) {
      const payload = buildEmploymentDetailsPayload(formData);
      try {
        await updateCreditReport(payload);
        toast.success("Employment details Submitted Successfully");
        setCurrentStep(2);
      } catch (error: any) {
        toast.error("Employment details submission failed");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (currentStep === 2) {
      try {
        await handleDocumentUpload();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (currentStep === 3) {
      setIsLoading(false);
      navigate("/eligible-loans");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    navigate("/compare-loan");
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const mapApiResponseToFormData = (apiData: any, mobile: string) => {
    const primaryEmail = apiData.emails?.[0]?.email || "";
    const addresses = Array.isArray(apiData?.addresses) ? apiData?.addresses : [];
    const residenceAddress = addresses.find((a: any) => a.type === "Residence") || addresses[0] || {};
    
    return {
      firstName: apiData.firstName ?? "",
      lastName: apiData.lastName ?? "",
      middleName: apiData.middleName ?? "",
      dateOfBirth: apiData.dateOfBirth?.split("T")[0] ?? "",
      panCard: apiData.panCard ?? "",
      email: primaryEmail ?? "",
      aadhaarCard: "",
      mobileNumber: mobile,
      uanNumber: apiData.uanNumber ?? "",
      employmentStatus: apiData.employmentStatus?.toLowerCase() ?? "",
      employmentExperience: apiData.employmentExperience ?? "",
      companyName: apiData.companyName ?? "",
      monthlyIncome: apiData.monthlyIncome ?? "",
      residentialStatus: residenceAddress.type ? residenceAddress.type.toLowerCase() : "",
      addressLine1: residenceAddress?.streetAddress ?? "",
      city: apiData.city ?? "",
      state: residenceAddress.state ?? "",
      pincode: residenceAddress.pincode ?? "",
      loanType: "",
      loanAmount: "",
      cibilScore: apiData.cibilScore ?? "",
      recentEnquiries: apiData.last6MonthsEnquiryCount ?? "",
      settlements: apiData.settlements ?? "",
      emiBounces: apiData.emiBounces ?? "",
      creditCardUtilization: apiData.creaditCardUtilization ?? "",
      residentialStability: "",
      existingEmi: apiData.existingEmi ?? "",
      loanTenure: apiData.loanTenure ?? "",
      salaryMode: apiData.salaryMode ?? "",
      employmentCategory: apiData.employmentCategory ?? "",
    };
  };

  const SummarySection = ({ title, icon: Icon, children }: any) => (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-primary/10 to-accent/30 px-5 py-3 border-b border-border/50">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const SummaryRow = ({ label, value, icon: Icon, highlighted }: any) => (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground text-sm flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary/60" />}
        {label}
      </span>
      <span className={cn(
        "text-sm font-medium text-right max-w-[60%] break-words whitespace-normal leading-relaxed",
        highlighted ? "text-primary font-semibold" : "text-foreground"
      )}>
        {value || "—"}
      </span>
    </div>
  );

  const DocumentStatus = ({ label, file, icon: Icon }: any) => (
    <div className="flex justify-between items-center py-2.5 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground text-sm flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary/60" />}
        {label}
      </span>
      {file ? (
        <span className="text-sm font-medium text-green-600 flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Uploaded
        </span>
      ) : (
        <span className="text-sm font-medium text-destructive flex items-center gap-1.5 bg-destructive/10 px-2.5 py-1 rounded-full">
          <AlertCircle className="w-3.5 h-3.5" />
          Missing
        </span>
      )}
    </div>
  );

  const autoFillUserDetails = async () => {
    try {
      setPageLoading(true);
      const mobile = sessionStorage.getItem("mobile_number");
      if (!mobile) {
        navigate("/", { replace: true });
        return;
      }
      
      const resp = await fetchCreditReport({ mobileNumber: mobile });
      const apiData = resp?.data?.data;
      
      if (apiData) {
        sessionStorage.setItem("userId", apiData._id);
        const apiEmails = Array.isArray(apiData.emails)
          ? apiData.emails.map((e: any) => e.email).filter(Boolean)
          : [];
        
        const uniqueEmails = [...new Set(apiEmails)] as string[];
        setEmailOptions(uniqueEmails);
        setFormData(mapApiResponseToFormData(apiData, mobile));
      }
    } catch (error) {
      console.error("Error in auto filling user details", error);
    } finally {
      setPageLoading(false);
    }
  };

  async function uploadFinancialDocsFrontend({ userId, requestedLoanAmount, requestedLoanTenure, loanType }: any) {
    try {
      await axios.post("https://m3pmjfgx-3000.inc1.devtunnels.ms/api/customer/upload-docs", {
        userId, requestedLoanAmount, requestedLoanTenure, loanType
      });
      return true;
    } catch (error) {
      console.error("Error in uploading", error);
      return false;
    }
  }

  const handleDocumentUpload = async () => {
    const userId = sessionStorage.getItem("userId");
    const isUploaded = await uploadFinancialDocsFrontend({
      userId,
      requestedLoanAmount: formData.loanAmount,
      requestedLoanTenure: formData.loanTenure,
      loanType: formData.loanType,
    });
    if (isUploaded) {
      setCurrentStep(3);
      toast.success("Documents uploaded successfully");
    } else {
      toast.error("Document upload failed");
    }
  };

  useEffect(() => {
    autoFillUserDetails();
  }, []);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md px-6">
          <p className="text-xl md:text-2xl font-bold text-slate-800 animate-pulse">
            Loading your <span className="text-[#7c3aed]">credit profile...</span>
          </p>
          <div className="w-full h-5 bg-white border-2 border-slate-200 rounded-full p-1 shadow-sm">
            <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] rounded-full animate-pulse w-[40%]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-br from-background via-background to-accent/20">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-4 py-8 md:py-12 max-w-7xl w-full">
        <div className="justify-center text-center mb-8">
          <h1 className="text-4xl md:text-3xl font-bold text-foreground mb-4">
            Loan <span className="text-[#7c3bed]">Application</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#7c3bed] to-transparent mx-auto rounded-full opacity-50 mb-4"></div>
          <p className="mt-2 text-muted-foreground">
            Complete all steps to submit your application
          </p>
        </div>

        <StepIndicator steps={steps} currentStep={currentStep + 1} />

        <div className="mt-8 space-y-6">
          {currentStep === 0 && (
            <FormCard title="Review & Edit Personal Details" subtitle="Your details have been auto-fetched. You may edit any field if needed.">
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border border-accent mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <p className="text-sm text-accent-foreground italic">*Review the pre-filled data. You may edit any field if needed.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormInput label="First Name" value={formData.firstName} onChange={(v) => updateFormData("firstName", v)} required error={errors.firstName} />
                  <FormInput label="Middle Name" value={formData.middleName} onChange={(v) => updateFormData("middleName", v)} />
                  <FormInput label="Last Name" value={formData.lastName} onChange={(v) => updateFormData("lastName", v)} required error={errors.lastName} />
                  <FormInput label="Date of Birth" value={formData.dateOfBirth} onChange={(v) => updateFormData("dateOfBirth", v)} type="date" max={getTodayISODate()} required error={errors.dateOfBirth} />
                  <FormInput label="PAN Card" value={formData.panCard} disabled hint="PAN cannot be edited as it's verified from source" error={errors.panCard} />
                  {emailOptions.length > 1 ? (
                    <FormSelect label="E-Mail ID" value={formData.email} onChange={(v) => updateFormData("email", v)} options={emailOptions.map(e => ({ value: e, label: e }))} required error={errors.email} />
                  ) : (
                    <FormInput label="E-Mail ID" value={formData.email} onChange={(v) => updateFormData("email", v)} type="email" required error={errors.email} />
                  )}
                  <FormInput label="Aadhaar Card" value={formData.aadhaarCard} disabled hint="Aadhaar cannot be edited as it's verified from source" />
                  <FormInput label="Mobile Number" value={formData.mobileNumber} onChange={(v) => updateFormData("mobileNumber", v)} type="tel" required error={errors.mobileNumber} />
                </div>
                <div className="space-y-6 mt-8 pt-6 border-t border-border">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />Address Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-foreground">Address Line 1</label>
                      <textarea value={formData.addressLine1} onChange={(e) => updateFormData("addressLine1", e.target.value)} className={cn("w-full rounded-md bg-background px-3 py-2 text-sm border border-input focus:outline-none focus:ring-2 focus:ring-primary", errors.addressLine1 && "border-destructive")} rows={3} />
                      {errors.addressLine1 && <p className="text-sm text-destructive mt-1">{errors.addressLine1}</p>}
                    </div>
                    <FormInput label="State" value={formData.state} onChange={(v) => updateFormData("state", v)} required error={errors.state} />
                    <FormInput label="Pincode" value={formData.pincode} onChange={(v) => updateFormData("pincode", v)} required error={errors.pincode} />
                  </div>
                </div>
              </div>
            </FormCard>
          )}

          {currentStep === 1 && (
            <FormCard title="Review & Edit Employment and Credit Details" subtitle="Please review and update your employment and credit information">
              <div className="space-y-6">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" />Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormSelect label="Employment Status" value={formData.employmentStatus} onChange={(v) => updateFormData("employmentStatus", v)} options={employmentStatuses} required error={errors.employmentStatus} />
                  <FormInput label="Company Name" value={formData.companyName} onChange={(v) => updateFormData("companyName", v)} required error={errors.companyName} />
                  <FormInput label="Employment Category" value={formData.employmentCategory} onChange={(v) => updateFormData("employmentCategory", v)} required error={errors.employmentCategory} />
                  <FormInput label="Employment Experience (Years)" value={formData.employmentExperience} type="number" step="0.1" onChange={(v) => updateFormData("employmentExperience", v)} required error={errors.employmentExperience} />
                  <FormInput label="UAN / PF Number" value={formData.uanNumber} onChange={(v) => updateFormData("uanNumber", v.replace(/\D/g, ""))} required error={errors.uanNumber} />
                  <FormInput label="Monthly Income (₹)" value={formData.monthlyIncome} onChange={(v) => updateFormData("monthlyIncome", v)} type="number" required error={errors.monthlyIncome} />
                  <FormSelect label="Salary Mode" value={formData.salaryMode} onChange={(v) => updateFormData("salaryMode", v)} required options={[{ value: "bank_transfer", label: "Bank Transfer" }, { value: "cash", label: "Cash" }]} error={errors.salaryMode} />
                </div>
              </div>
              <div className="space-y-6 mt-8 pt-6 border-t border-border">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" />Credit Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormInput label="CIBIL Score" value={formData.cibilScore} onChange={(v) => updateFormData("cibilScore", v)} required error={errors.cibilScore} />
                  <FormInput label="Recent Enquiries" value={formData.recentEnquiries} onChange={(v) => updateFormData("recentEnquiries", v)} required error={errors.recentEnquiries} />
                  <FormInput label="Settlements" value={formData.settlements} onChange={(v) => updateFormData("settlements", v)} required error={errors.settlements} />
                  <FormInput label="EMI Bounces" value={formData.emiBounces} onChange={(v) => updateFormData("emiBounces", v)} required error={errors.emiBounces} />
                  <FormInput label="Credit Card Utilization (%)" value={formData.creditCardUtilization} onChange={(v) => updateFormData("creditCardUtilization", v)} required error={errors.creditCardUtilization} />
                  <FormSelect label="Residential Stability" value={formData.residentialStability} onChange={(v) => updateFormData("residentialStability", v)} required options={[{ value: "1", label: "Less than 1 year" }, { value: "3", label: "1-3 years" }, { value: "5", label: "3-5 years" }, { value: "10", label: "More than 5 years" }]} error={errors.residentialStability} />
                  <FormInput label="Existing EMI (₹)" value={formData.existingEmi} onChange={(v) => updateFormData("existingEmi", v)} type="number" required error={errors.existingEmi} />
                </div>
              </div>
            </FormCard>
          )}

          {currentStep === 2 && (
            <FormCard title="Loan Requirement & Document Upload" subtitle="Select your loan type and upload required documents">
              <div className="space-y-6">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2"><span className="w-1.5 h-5 bg-primary rounded-full" />Loan Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormSelect label="Loan Type" value={formData.loanType} onChange={(v) => updateFormData("loanType", v)} options={loanTypes} required error={errors.loanType} />
                  <FormInput label="Desired Loan Amount (₹)" value={formData.loanAmount} onChange={(v) => updateFormData("loanAmount", v)} type="number" required error={errors.loanAmount} />
                  <FormInput label="Desired Loan Tenure (months)" value={formData.loanTenure} onChange={(v) => updateFormData("loanTenure", v)} type="number" required error={errors.loanTenure} />
                </div>
              </div>
              <div className="space-y-6 mt-8 pt-6 border-t border-border">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2"><span className="w-1.5 h-5 bg-primary rounded-full" />Required Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FileUploadZone label="Last 3 Years ITR/Form 16" required accept=".pdf,.jpg,.png" onFileSelect={(file) => setDocuments((prev: any) => ({ ...prev, itr: file }))} />
                  <FileUploadZone label="Applicant Photo" required accept=".jpg,.png,.jpeg" onFileSelect={(file) => setDocuments((prev: any) => ({ ...prev, photo: file }))} />
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-foreground mb-4">Last 3 Months Payslips<span className="text-destructive ml-1">*</span></h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FileUploadZone label="Month 1" required accept=".pdf,.jpg,.png" compact onFileSelect={(file) => setDocuments((prev: any) => ({ ...prev, payslip1: file }))} />
                    <FileUploadZone label="Month 2" required accept=".pdf,.jpg,.png" compact onFileSelect={(file) => setDocuments((prev: any) => ({ ...prev, payslip2: file }))} />
                    <FileUploadZone label="Month 3" required accept=".pdf,.jpg,.png" compact onFileSelect={(file) => setDocuments((prev: any) => ({ ...prev, payslip3: file }))} />
                  </div>
                </div>
              </div>
            </FormCard>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-xl shadow-primary/25">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-primary-foreground/80 text-sm font-medium mb-1">Application Summary</p>
                    <h2 className="text-2xl font-bold">{formData.firstName} {formData.middleName} {formData.lastName}</h2>
                    <p className="text-primary-foreground/80 mt-1">{formData.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-foreground/80 text-sm font-medium mb-1">Requested Amount</p>
                    <p className="text-3xl font-bold">₹{Number(formData.loanAmount).toLocaleString("en-IN")}</p>
                    <p className="text-primary-foreground/80 mt-1">{loanTypes.find((l) => l.value === formData.loanType)?.label}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SummarySection title="Personal Details" icon={User}>
                  <SummaryRow label="Full Name" value={`${formData.firstName} ${formData.middleName} ${formData.lastName}`} icon={User} />
                  <SummaryRow label="Date of Birth" value={formData.dateOfBirth} icon={Calendar} />
                  <SummaryRow label="Mobile" value={formData.mobileNumber} icon={Phone} />
                  <SummaryRow label="Email" value={formData.email} icon={Mail} />
                  <SummaryRow label="PAN Card" value={formData.panCard} icon={CreditCard} highlighted />
                </SummarySection>
                <SummarySection title="Address Details" icon={MapPin}>
                  <SummaryRow label="Address" value={formData.addressLine1} icon={Home} />
                  <SummaryRow label="State" value={formData.state} icon={MapPin} />
                  <SummaryRow label="Pincode" value={formData.pincode} />
                </SummarySection>
                <SummarySection title="Employment Details" icon={Briefcase}>
                  <SummaryRow label="Status" value={employmentStatuses.find((e) => e.value === formData.employmentStatus)?.label || ""} icon={Briefcase} />
                  <SummaryRow label="Company" value={formData.companyName} icon={Building} />
                  <SummaryRow label="Monthly Income" value={`₹${Number(formData.monthlyIncome).toLocaleString("en-IN")}`} icon={IndianRupee} highlighted />
                </SummarySection>
                <SummarySection title="Credit Information" icon={CreditCard}>
                  <SummaryRow label="CIBIL Score" value={formData.cibilScore} icon={CreditCard} highlighted />
                  <SummaryRow label="Recent Enquiries" value={formData.recentEnquiries} />
                  <SummaryRow label="EMI Bounces" value={formData.emiBounces} />
                </SummarySection>
              </div>
              <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-4">Terms & Consent</h3>
                <div className="space-y-4">
                  <div className={cn("flex items-start space-x-3 p-3 rounded-md border", consentError && !termsAccepted ? "border-destructive bg-destructive/5" : "border-border")}>
                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked: boolean) => setTermsAccepted(checked)} />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">I hereby declare that all the information provided is true and accurate to the best of my knowledge.</label>
                  </div>
                  <div className={cn("flex items-start space-x-3 p-3 rounded-md border", consentError && !privacyAccepted ? "border-destructive bg-destructive/5" : "border-border")}>
                    <Checkbox id="privacy" checked={privacyAccepted} onCheckedChange={(checked: boolean) => setPrivacyAccepted(checked)} />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">I have read and agree to the Terms of Service and Privacy Policy.</label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="h-12 px-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {currentStep < 3 ? (
            <Button onClick={handleNext} disabled={isLoading} className="h-12 px-8">
              {isLoading ? <Loader size={20} /> : <><span className="mr-2">Next</span><ArrowRight className="w-4 h-4" /></>}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!termsAccepted || !privacyAccepted} className="h-12 px-8">
              <Send className="w-4 h-4 mr-2" /> Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;