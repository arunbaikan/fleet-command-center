import { useState } from "react";
import { mockLeads, LeadStatus } from "@/lib/mockData";
import LeadCard from "@/components/fleet/LeadCard";
import { cn } from "@/lib/utils";

const filters: { label: string; value: LeadStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "LEAD_INITIATED" },
  { label: "Pending", value: "DOC_VERIFICATION" },
  { label: "Review", value: "UNDERWRITING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Disbursed", value: "DISBURSED" },
  { label: "Rejected", value: "REJECTED_RISK" },
];

const Leads = () => {
  const [activeFilter, setActiveFilter] = useState<LeadStatus | "ALL">("ALL");

  const filtered = activeFilter === "ALL"
    ? mockLeads
    : mockLeads.filter((l) => l.status === activeFilter);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Your Leads</h2>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all",
              activeFilter === f.value
                ? "gold-gradient text-primary-foreground shadow"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lead List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card-elevated rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">No leads in this category.</p>
          </div>
        ) : (
          filtered.map((lead, i) => <LeadCard key={lead.id} lead={lead} index={i} />)
        )}
      </div>
    </div>
  );
};

export default Leads;
