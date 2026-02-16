import EarningsCard from "@/components/fleet/EarningsCard";
import { partnerProfile, mockLeads } from "@/lib/mockData";
import StatusBadge from "@/components/fleet/StatusBadge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Share2, Users, TrendingUp, ArrowRight, Target, Activity } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const Dashboard = () => {
  const recentLeads = mockLeads.slice(0, 5);

  const stats = useMemo(() => {
    const activeThisWeek = mockLeads.filter(
      (l) => new Date(l.updatedAt) >= new Date(Date.now() - 7 * 86400000)
    ).length;
    const pendingReview = mockLeads.filter(
      (l) => l.status === "UNDERWRITING" || l.status === "DOC_VERIFICATION"
    ).length;

    return [
      { label: "Total Leads", value: partnerProfile.totalLeads, icon: Users, color: "text-foreground" },
      { label: "Conversion Rate", value: `${partnerProfile.conversionRate}%`, icon: TrendingUp, color: "text-accent" },
      { label: "Active This Week", value: activeThisWeek, icon: Activity, color: "text-status-review" },
      { label: "Pending Review", value: pendingReview, icon: Target, color: "text-primary" },
    ];
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(partnerProfile.referralLink);
    toast.success("Referral link copied!");
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back, {partnerProfile.name} <span className="gold-text">⚓</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Here's your partner performance at a glance.</p>
      </div>

      {/* Top Row: Earnings + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <EarningsCard />
        </div>
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-elevated rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
              <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Magic Link + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Magic Link */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-5 card-elevated rounded-xl p-5"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Your Magic Link</p>
          <div className="rounded-lg bg-background px-4 py-3 text-sm text-muted-foreground font-mono border border-border break-all mb-4">
            {partnerProfile.referralLink}
          </div>
          <div className="flex gap-3">
            <button
              onClick={copyLink}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
            >
              <Copy className="h-4 w-4" /> Copy Link
            </button>
            <button
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Apply for a personal loan here: ${partnerProfile.referralLink}`)}`, "_blank")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald py-3 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <Share2 className="h-4 w-4" /> WhatsApp
            </button>
          </div>
        </motion.div>

        {/* Recent Leads */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Recent Leads</h3>
            <Link to="/leads" className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="card-elevated rounded-xl divide-y divide-border overflow-hidden">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                    {lead.customerName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{lead.customerName}</p>
                    <p className="text-xs text-muted-foreground">{lead.id} · ₹{lead.loanAmount.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
