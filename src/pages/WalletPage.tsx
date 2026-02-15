import { partnerProfile, mockLeads } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Download, IndianRupee, CalendarDays, Trophy, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

const WalletPage = () => {
  const [hasConfettied, setHasConfettied] = useState(false);
  const disbursedLeads = mockLeads.filter((l) => l.status === "DISBURSED");
  const totalCommission = disbursedLeads.reduce((sum, l) => sum + (l.commission || 0), 0);

  useEffect(() => {
    if (totalCommission > 0 && !hasConfettied) {
      setHasConfettied(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.3 }, colors: ["#d4a017", "#f5c842", "#16a34a"] });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl gold-gradient p-[1px] card-glow">
          <div className="rounded-[11px] bg-card p-6 text-center space-y-2 h-full flex flex-col justify-center">
            <Trophy className="h-7 w-7 text-primary mx-auto" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Lifetime Earnings</p>
            <p className="text-4xl font-black gold-text">₹{partnerProfile.totalEarnings.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground">Tier: <span className="text-primary font-semibold">{partnerProfile.tier}</span></p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-elevated rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending Payout</p>
          </div>
          <p className="text-3xl font-bold text-primary">₹{partnerProfile.pendingPayout.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted-foreground mt-1">Expected by end of month</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">This Month</p>
          </div>
          <p className="text-3xl font-bold text-accent">₹{totalCommission.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted-foreground mt-1">{disbursedLeads.length} disbursements</p>
        </motion.div>
      </div>

      {/* Commission History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Commission History</h3>
          <button className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-all">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>

        <div className="card-elevated rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-secondary/30">
            <span>Lead ID</span>
            <span>Customer</span>
            <span>Loan Amount</span>
            <span>Disbursed On</span>
            <span className="text-right">Commission</span>
          </div>
          {disbursedLeads.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No disbursements yet. Keep going! 🏴‍☠️</div>
          ) : (
            disbursedLeads.map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-5 gap-4 px-5 py-4 items-center border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
              >
                <span className="text-sm font-mono text-muted-foreground">{lead.id}</span>
                <span className="text-sm font-medium text-foreground">{lead.customerName}</span>
                <span className="text-sm text-foreground">₹{lead.loanAmount.toLocaleString("en-IN")}</span>
                <span className="text-sm text-muted-foreground">{lead.updatedAt}</span>
                <span className="text-sm font-bold text-accent text-right">+₹{(lead.commission || 0).toLocaleString("en-IN")}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
