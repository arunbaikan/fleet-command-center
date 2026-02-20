import { useState } from "react";
import { Lead, LOAN_PRODUCTS, STATUS_MAP } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Users, User } from "lucide-react";
import { toast } from "sonner";

interface SendUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leads: Lead[];
}

const quickTemplates = [
  "Your loan application is being processed. We'll update you shortly.",
  "Documents received. Your file is under review.",
  "Great news! Your loan has been approved. Please check your offer.",
  "Reminder: Please upload pending documents to proceed with your application.",
];

const SendUpdateDialog = ({ open, onOpenChange, leads }: SendUpdateDialogProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const isBulk = leads.length > 1;

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(
        isBulk
          ? `Update sent to ${leads.length} leads via WhatsApp`
          : `Update sent to ${leads[0]?.customerName} via WhatsApp`
      );
      setMessage("");
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isBulk ? <Users className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-primary" />}
            {isBulk ? `Send Update to ${leads.length} Leads` : `Send Update`}
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? "This message will be sent to all filtered leads via WhatsApp."
              : leads[0] && (
                  <span>
                    To <strong>{leads[0].customerName}</strong> ({leads[0].id}) · {LOAN_PRODUCTS[leads[0].loanProduct]} · {STATUS_MAP[leads[0].status].label}
                  </span>
                )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {quickTemplates.map((t, i) => (
              <button
                key={i}
                onClick={() => setMessage(t)}
                className="rounded-lg bg-secondary px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors text-left"
              >
                {t.slice(0, 45)}…
              </button>
            ))}
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your update message…"
            rows={4}
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending || !message.trim()} className="gap-2">
            <Send className="h-4 w-4" />
            {sending ? "Sending…" : isBulk ? `Send to All (${leads.length})` : "Send Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendUpdateDialog;
