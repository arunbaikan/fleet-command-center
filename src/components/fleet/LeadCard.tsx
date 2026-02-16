import { forwardRef } from "react";
import { Lead, STATUS_MAP } from "@/lib/mockData";
import StatusBadge from "./StatusBadge";
import { MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

const LeadCard = forwardRef<HTMLDivElement, { lead: Lead; index: number }>(
  ({ lead, index }, ref) => {
    const statusInfo = STATUS_MAP[lead.status];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="card-elevated rounded-xl p-4"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-foreground text-sm">{lead.customerName}</p>
            <p className="text-xs text-muted-foreground">{lead.id} · {lead.mobile}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-lg font-bold text-foreground">₹{lead.loanAmount.toLocaleString("en-IN")}</p>
            {lead.commission && (
              <p className="text-xs font-medium text-accent">+₹{lead.commission.toLocaleString("en-IN")} earned</p>
            )}
            {lead.rejectionReason && (
              <p className="text-xs text-destructive font-medium mt-0.5">Reason: {lead.rejectionReason}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(`https://wa.me/${lead.mobile.replace(/\*/g, '')}`, "_blank")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald/10 text-accent transition-colors hover:bg-emerald/20"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => window.open(`tel:${lead.mobile}`, "_self")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <Phone className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground mt-2">{statusInfo.description}</p>
      </motion.div>
    );
  }
);

LeadCard.displayName = "LeadCard";

export default LeadCard;
