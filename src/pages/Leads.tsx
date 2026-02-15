import { useState } from "react";
import { mockLeads, LeadStatus } from "@/lib/mockData";
import LeadCard from "@/components/fleet/LeadCard";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const filters: { label: string; value: LeadStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "LEAD_INITIATED" },
  { label: "Docs Pending", value: "DOC_VERIFICATION" },
  { label: "In Review", value: "UNDERWRITING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Disbursed", value: "DISBURSED" },
  { label: "Rejected", value: "REJECTED_RISK" },
];

const Leads = () => {
  const [activeFilter, setActiveFilter] = useState<LeadStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = mockLeads
    .filter((l) => activeFilter === "ALL" || l.status === activeFilter)
    .filter((l) => !search || l.customerName.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Search + Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
                activeFilter === f.value
                  ? "gold-gradient text-primary-foreground shadow"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lead Grid */}
      {filtered.length === 0 ? (
        <div className="card-elevated rounded-xl p-12 text-center">
          <p className="text-sm text-muted-foreground">No leads match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((lead, i) => <LeadCard key={lead.id} lead={lead} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Leads;
