import { useState, useMemo, useCallback } from "react";
import { mockLeads, Lead, LeadStatus, LoanProduct, LOAN_PRODUCTS } from "@/lib/mockData";
import LeadCard from "@/components/fleet/LeadCard";
import SendUpdateDialog from "@/components/fleet/SendUpdateDialog";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, ArrowUpDown, Briefcase, Send } from "lucide-react";

const statusFilters: { label: string; value: LeadStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "LEAD_INITIATED" },
  { label: "Docs Pending", value: "DOC_VERIFICATION" },
  { label: "In Review", value: "UNDERWRITING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Disbursed", value: "DISBURSED" },
  { label: "Rejected", value: "REJECTED_RISK" },
];

const productFilters: { label: string; value: LoanProduct | "ALL" }[] = [
  { label: "All Products", value: "ALL" },
  ...Object.entries(LOAN_PRODUCTS).map(([key, label]) => ({ label, value: key as LoanProduct })),
];

type SortOption = "newest" | "oldest" | "amount_high" | "amount_low";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Amount: High → Low", value: "amount_high" },
  { label: "Amount: Low → High", value: "amount_low" },
];

const Leads = () => {
  const [activeFilter, setActiveFilter] = useState<LeadStatus | "ALL">("ALL");
  const [productFilter, setProductFilter] = useState<LoanProduct | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateTargetLeads, setUpdateTargetLeads] = useState<Lead[]>([]);

  const handleSendUpdate = useCallback((lead: Lead) => {
    setUpdateTargetLeads([lead]);
    setUpdateDialogOpen(true);
  }, []);

  const filtered = useMemo(() => {
    let results = mockLeads
      .filter((l) => activeFilter === "ALL" || l.status === activeFilter)
      .filter((l) => productFilter === "ALL" || l.loanProduct === productFilter)
      .filter(
        (l) =>
          !search ||
          l.customerName.toLowerCase().includes(search.toLowerCase()) ||
          l.id.toLowerCase().includes(search.toLowerCase()) ||
          LOAN_PRODUCTS[l.loanProduct].toLowerCase().includes(search.toLowerCase())
      );

    results.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount_high": return b.loanAmount - a.loanAmount;
        case "amount_low": return a.loanAmount - b.loanAmount;
        default: return 0;
      }
    });

    return results;
  }, [activeFilter, productFilter, sortBy, search]);

  const handleSendToAll = useCallback(() => {
    setUpdateTargetLeads(filtered);
    setUpdateDialogOpen(true);
  }, [filtered]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: mockLeads.length };
    mockLeads.forEach((l) => {
      map[l.status] = (map[l.status] || 0) + 1;
    });
    return map;
  }, []);

  const productCounts = useMemo(() => {
    const map: Record<string, number> = { ALL: mockLeads.length };
    mockLeads.forEach((l) => {
      map[l.loanProduct] = (map[l.loanProduct] || 0) + 1;
    });
    return map;
  }, []);

  const activeFilterCount = (productFilter !== "ALL" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  return (
    <div className="space-y-5">
      {/* Search + Filter Toggle */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID or product..."
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
              showFilters || activeFilterCount > 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full pb-1">
          {statusFilters.map((f) => (
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
              {f.label} ({counts[f.value] || 0})
            </button>
          ))}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="card-elevated rounded-xl p-4 space-y-4">
            {/* Product Type */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Loan Product</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {productFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setProductFilter(f.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                      productFilter === f.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label} ({productCounts[f.value] || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sort By</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSortBy(s.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                      sortBy === s.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setProductFilter("ALL"); setSortBy("newest"); }}
                className="text-xs text-primary font-medium hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} lead{filtered.length !== 1 ? "s" : ""} found</p>
        {filtered.length > 0 && (
          <button
            onClick={handleSendToAll}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Send className="h-3.5 w-3.5" />
            Send Update to All ({filtered.length})
          </button>
        )}
      </div>

      {/* Lead Grid */}
      {filtered.length === 0 ? (
        <div className="card-elevated rounded-xl p-12 text-center">
          <p className="text-sm text-muted-foreground">No leads match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((lead, i) => <LeadCard key={lead.id} lead={lead} index={i} onSendUpdate={handleSendUpdate} />)}
        </div>
      )}

      <SendUpdateDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        leads={updateTargetLeads}
      />
    </div>
  );
};

export default Leads;
