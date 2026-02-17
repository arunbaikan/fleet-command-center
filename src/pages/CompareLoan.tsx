import React, { useState } from 'react';
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Zap, 
  Clock, 
  IndianRupee,
  ChevronRight,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockLoanOffers, LoanOffer } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CompareLoan = () => {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rate' | 'emi' | 'rating'>('rate');

  const sortedOffers = [...mockLoanOffers].sort((a, b) => {
    if (sortBy === 'rate') return a.interestRate - b.interestRate;
    if (sortBy === 'emi') return a.monthlyEmi - b.monthlyEmi;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const handleSelectOffer = (offer: LoanOffer) => {
    setSelectedOffer(offer.id);
    toast.success(`Selected ${offer.bankName} offer! Proceeding to final steps.`);
    // In a real app, this would navigate to a final confirmation or disbursal page
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Compare Loan Offers</h1>
              <p className="text-xs text-muted-foreground">Based on your credit profile and requirements</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Verified Offers</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* Filters & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Button variant="outline" size="sm" className="rounded-full gap-2 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filters
            </Button>
            <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
            <button 
              onClick={() => setSortBy('rate')}
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full transition-all",
                sortBy === 'rate' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              Interest Rate
            </button>
            <button 
              onClick={() => setSortBy('emi')}
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full transition-all",
                sortBy === 'emi' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              Lowest EMI
            </button>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Showing {sortedOffers.length} personalized offers
          </p>
        </div>

        {/* Offers List */}
        <div className="space-y-6">
          {sortedOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative bg-card rounded-2xl border transition-all duration-300 overflow-hidden",
                selectedOffer === offer.id ? "border-primary ring-2 ring-primary/20 shadow-xl" : "border-border hover:border-primary/50 hover:shadow-lg"
              )}
            >
              {index === 0 && sortBy === 'rate' && (
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-br-xl z-10 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> BEST VALUE
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Bank Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="w-14 h-14 rounded-xl border border-border bg-white p-2 flex items-center justify-center shadow-sm">
                      <img src={offer.bankLogo} alt={offer.bankName} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{offer.bankName}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-foreground">{offer.rating}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">(Verified)</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Interest Rate</p>
                      <p className="text-xl font-black text-primary">{offer.interestRate}% <span className="text-xs font-medium text-muted-foreground">p.a.</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Monthly EMI</p>
                      <p className="text-xl font-black text-foreground">₹{offer.monthlyEmi.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="space-y-1 hidden md:block">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Processing Fee</p>
                      <p className="text-sm font-bold text-foreground">{offer.processingFee}</p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <Button 
                      onClick={() => handleSelectOffer(offer)}
                      className={cn(
                        "w-full h-11 rounded-xl font-bold transition-all",
                        selectedOffer === offer.id ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
                      )}
                    >
                      {selectedOffer === offer.id ? (
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Selected</span>
                      ) : (
                        "Select Offer"
                      )}
                    </Button>
                    <button className="text-[10px] text-muted-foreground hover:text-primary font-medium flex items-center justify-center gap-1">
                      <Info className="w-3 h-3" /> View Details
                    </button>
                  </div>
                </div>

                {/* Features & Footer */}
                <div className="mt-6 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-3">
                    {offer.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-[10px] font-medium text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {offer.tenure}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Total: ₹{offer.totalRepayment.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Need help choosing?</h4>
              <p className="text-sm text-muted-foreground">Our loan experts are available to guide you through the selection process.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/10">
            Talk to Expert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompareLoan;