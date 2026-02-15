import EarningsCard from "@/components/fleet/EarningsCard";
import { partnerProfile, mockLeads } from "@/lib/mockData";
import StatusBadge from "@/components/fleet/StatusBadge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Share2, Users, TrendingUp, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const recentLeads = mockLeads.slice(0, 3);

  const stats = [
    { label: "Total Leads", value: partnerProfile.totalLeads, icon: Users },
    { label: "Conversion", value: `${partnerProfile.conversionRate}%`, icon: TrendingUp },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(partnerProfile.referralLink);
    toast.success("Referral link copied!");
  };

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h2 className="text-xl font-bold text-foreground">
          {partnerProfile.name} <span className="gold-text">⚓</span>
        </h2>
      </div>

      <EarningsCard />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-elevated rounded-xl p-3.5"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Share */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated rounded-xl p-4"
      >
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Your Magic Link</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground font-mono truncate border border-border">
            {partnerProfile.referralLink}
          </div>
          <button
            onClick={copyLink}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform active:scale-95"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              window.open(`https://wa.me/?text=${encodeURIComponent(`Apply for a personal loan here: ${partnerProfile.referralLink}`)}`, "_blank");
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald text-accent-foreground transition-transform active:scale-95"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Leads</h3>
          <Link to="/leads" className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="card-elevated rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{lead.customerName}</p>
                <p className="text-xs text-muted-foreground">₹{lead.loanAmount.toLocaleString("en-IN")}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
