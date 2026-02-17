import { partnerProfile } from "@/lib/mockData";
import { TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

const EarningsCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl gold-gradient p-[1px] card-glow"
    >
      <div className="rounded-[11px] bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Earnings</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            <TrendingUp className="h-3 w-3" /> +18%
          </span>
        </div>
        <p className="text-3xl font-bold purple-text tracking-tight">
          ₹{partnerProfile.totalEarnings.toLocaleString("en-IN")}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Pending: </span>
          <span className="font-semibold text-primary">₹{partnerProfile.pendingPayout.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EarningsCard;
