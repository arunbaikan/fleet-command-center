import { partnerProfile, mockLeads } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Download, IndianRupee, CalendarDays, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

const WalletPage = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const disbursedLeads = mockLeads.filter((l) => l.status === "DISBURSED");
  const totalCommission = disbursedLeads.reduce((sum, l) => sum + (l.commission || 0), 0);

  useEffect(() => {
    // Fire confetti on first visit if there are earnings
    if (totalCommission > 0 && !showConfetti) {
      setShowConfetti(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.3 },
        colors: ["#d4a017", "#f5c842", "#16a34a"],
      });
    }
  }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">Wallet & Payouts</h2>

      {/* Total Earnings Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl gold-gradient p-[1px] card-glow"
      >
        <div className="rounded-[11px] bg-card p-5 text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Lifetime Earnings</p>
          <p className="text-4xl font-black gold-text">₹{partnerProfile.totalEarnings.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted-foreground">
            Partner Tier: <span className="font-semibold text-primary">{partnerProfile.tier}</span>
          </p>
        </div>
      </motion.div>

      {/* Pending + This Month */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="card-elevated rounded-xl p-4"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending</p>
          </div>
          <p className="text-xl font-bold text-primary">₹{partnerProfile.pendingPayout.toLocaleString("en-IN")}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-elevated rounded-xl p-4"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">This Month</p>
          </div>
          <p className="text-xl font-bold text-accent">₹{totalCommission.toLocaleString("en-IN")}</p>
        </motion.div>
      </div>

      {/* Commission History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Commission History</h3>
          <button className="flex items-center gap-1 text-xs text-primary font-medium">
            <Download className="h-3 w-3" /> Export
          </button>
        </div>
        <div className="space-y-2">
          {disbursedLeads.map((lead) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated rounded-xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{lead.customerName}</p>
                <p className="text-xs text-muted-foreground">{lead.id} · Disbursed {lead.updatedAt}</p>
              </div>
              <p className="text-sm font-bold text-accent">+₹{(lead.commission || 0).toLocaleString("en-IN")}</p>
            </motion.div>
          ))}

          {disbursedLeads.length === 0 && (
            <div className="card-elevated rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground">No disbursements yet. Keep going! 🏴‍☠️</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
