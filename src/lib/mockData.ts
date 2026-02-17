export type LeadStatus = 
  | "LEAD_INITIATED"
  | "DOC_VERIFICATION"
  | "UNDERWRITING"
  | "APPROVED"
  | "DISBURSED"
  | "REJECTED_RISK";

export type LoanProduct = "personal_loan" | "business_loan" | "home_loan" | "gold_loan" | "vehicle_loan";

export const LOAN_PRODUCTS: Record<LoanProduct, string> = {
  personal_loan: "Personal Loan",
  business_loan: "Business Loan",
  home_loan: "Home Loan",
  gold_loan: "Gold Loan",
  vehicle_loan: "Vehicle Loan",
};

export interface Lead {
  id: string;
  customerName: string;
  mobile: string;
  loanAmount: number;
  loanProduct: LoanProduct;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  commission?: number;
}

export interface LoanOffer {
  id: string;
  bankName: string;
  bankLogo: string;
  interestRate: number;
  processingFee: string;
  tenure: string;
  monthlyEmi: number;
  totalRepayment: number;
  rating: number;
  features: string[];
}

export const STATUS_MAP: Record<LeadStatus, { label: string; description: string; colorKey: string }> = {
  LEAD_INITIATED: { label: "Draft / Link Sent", description: "Customer clicked but hasn't finished. Call them.", colorKey: "status-draft" },
  DOC_VERIFICATION: { label: "Docs Pending", description: "Application started. Waiting for uploads.", colorKey: "status-pending" },
  UNDERWRITING: { label: "In Review", description: "File is with the Lender. Do not disturb.", colorKey: "status-review" },
  APPROVED: { label: "Offer Generated!", description: "Tell customer to accept the offer ASAP.", colorKey: "status-approved" },
  DISBURSED: { label: "Disbursed ✓", description: "Money in bank. Commission locked.", colorKey: "status-disbursed" },
  REJECTED_RISK: { label: "Rejected", description: "See reason below.", colorKey: "status-rejected" },
};

export const mockLeads: Lead[] = [
  { id: "LD-1042", customerName: "Rajesh Kumar", mobile: "98765*****", loanAmount: 500000, loanProduct: "personal_loan", status: "DISBURSED", createdAt: "2026-02-10", updatedAt: "2026-02-14", commission: 5000 },
  { id: "LD-1043", customerName: "Priya Sharma", mobile: "91234*****", loanAmount: 300000, loanProduct: "home_loan", status: "APPROVED", createdAt: "2026-02-12", updatedAt: "2026-02-15" },
  { id: "LD-1044", customerName: "Amit Patel", mobile: "99876*****", loanAmount: 750000, loanProduct: "business_loan", status: "UNDERWRITING", createdAt: "2026-02-13", updatedAt: "2026-02-14" },
  { id: "LD-1045", customerName: "Sneha Reddy", mobile: "98123*****", loanAmount: 200000, loanProduct: "gold_loan", status: "DOC_VERIFICATION", createdAt: "2026-02-14", updatedAt: "2026-02-14" },
  { id: "LD-1046", customerName: "Vikram Singh", mobile: "90012*****", loanAmount: 400000, loanProduct: "vehicle_loan", status: "LEAD_INITIATED", createdAt: "2026-02-15", updatedAt: "2026-02-15" },
  { id: "LD-1047", customerName: "Deepa Nair", mobile: "98001*****", loanAmount: 600000, loanProduct: "personal_loan", status: "REJECTED_RISK", createdAt: "2026-02-08", updatedAt: "2026-02-11", rejectionReason: "FOIR > 60%" },
  { id: "LD-1048", customerName: "Suresh Gupta", mobile: "97654*****", loanAmount: 350000, loanProduct: "business_loan", status: "DISBURSED", createdAt: "2026-02-05", updatedAt: "2026-02-09", commission: 3500 },
];

export const mockLoanOffers: LoanOffer[] = [
  {
    id: "OFF-001",
    bankName: "HDFC Bank",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/2560px-HDFC_Bank_Logo.svg.png",
    interestRate: 10.5,
    processingFee: "₹2,500 + GST",
    tenure: "60 Months",
    monthlyEmi: 10747,
    totalRepayment: 644820,
    rating: 4.8,
    features: ["Instant Approval", "No Prepayment Charges", "Digital Process"]
  },
  {
    id: "OFF-002",
    bankName: "ICICI Bank",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/2560px-ICICI_Bank_Logo.svg.png",
    interestRate: 10.75,
    processingFee: "1% of Loan Amount",
    tenure: "60 Months",
    monthlyEmi: 10808,
    totalRepayment: 648480,
    rating: 4.6,
    features: ["Flexible Tenure", "Minimal Documentation", "Top-up Facility"]
  },
  {
    id: "OFF-003",
    bankName: "Axis Bank",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/2560px-Axis_Bank_logo.svg.png",
    interestRate: 11.0,
    processingFee: "₹1,999 Fixed",
    tenure: "60 Months",
    monthlyEmi: 10871,
    totalRepayment: 652260,
    rating: 4.5,
    features: ["Special Rates for Women", "Quick Disbursal", "Online Tracking"]
  },
  {
    id: "OFF-004",
    bankName: "SBI",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-Logo.svg/2560px-SBI-Logo.svg.png",
    interestRate: 9.9,
    processingFee: "Nil",
    tenure: "60 Months",
    monthlyEmi: 10598,
    totalRepayment: 635880,
    rating: 4.7,
    features: ["Lowest Interest Rate", "Government Trust", "Wide Branch Network"]
  }
];

export const partnerProfile = {
  name: "Arjun Mehta",
  partnerId: "CP_5501",
  tier: "Gold",
  totalEarnings: 42500,
  pendingPayout: 8500,
  totalLeads: 47,
  conversionRate: 62,
  referralLink: "https://happirate.in/apply?ref=CP_5501",
};