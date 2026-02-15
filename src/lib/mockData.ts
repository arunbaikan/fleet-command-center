export type LeadStatus = 
  | "LEAD_INITIATED"
  | "DOC_VERIFICATION"
  | "UNDERWRITING"
  | "APPROVED"
  | "DISBURSED"
  | "REJECTED_RISK";

export interface Lead {
  id: string;
  customerName: string;
  mobile: string;
  loanAmount: number;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  commission?: number;
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
  { id: "LD-1042", customerName: "Rajesh Kumar", mobile: "98765*****", loanAmount: 500000, status: "DISBURSED", createdAt: "2026-02-10", updatedAt: "2026-02-14", commission: 5000 },
  { id: "LD-1043", customerName: "Priya Sharma", mobile: "91234*****", loanAmount: 300000, status: "APPROVED", createdAt: "2026-02-12", updatedAt: "2026-02-15" },
  { id: "LD-1044", customerName: "Amit Patel", mobile: "99876*****", loanAmount: 750000, status: "UNDERWRITING", createdAt: "2026-02-13", updatedAt: "2026-02-14" },
  { id: "LD-1045", customerName: "Sneha Reddy", mobile: "98123*****", loanAmount: 200000, status: "DOC_VERIFICATION", createdAt: "2026-02-14", updatedAt: "2026-02-14" },
  { id: "LD-1046", customerName: "Vikram Singh", mobile: "90012*****", loanAmount: 400000, status: "LEAD_INITIATED", createdAt: "2026-02-15", updatedAt: "2026-02-15" },
  { id: "LD-1047", customerName: "Deepa Nair", mobile: "98001*****", loanAmount: 600000, status: "REJECTED_RISK", createdAt: "2026-02-08", updatedAt: "2026-02-11", rejectionReason: "FOIR > 60%" },
  { id: "LD-1048", customerName: "Suresh Gupta", mobile: "97654*****", loanAmount: 350000, status: "DISBURSED", createdAt: "2026-02-05", updatedAt: "2026-02-09", commission: 3500 },
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
