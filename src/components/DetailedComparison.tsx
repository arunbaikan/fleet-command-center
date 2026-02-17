import { Lender } from '@/Data/lenders';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface DetailedComparisonProps {
  lender1: Lender;
  lender2: Lender;
  onSelectForLetter: (lender: Lender) => void;
}

export const DetailedComparison = ({ lender1, lender2, onSelectForLetter }: DetailedComparisonProps) => {
  const Section = ({ 
    title, 
    icon: Icon, 
    items1, 
    items2, 
    type 
  }: { 
    title: string; 
    icon: React.ElementType; 
    items1: string[]; 
    items2: string[];
    type: 'pros' | 'cons' | 'unique' | 'restrictions';
  }) => {
    const getIconColor = () => {
      switch (type) {
        case 'pros': return 'text-green-600';
        case 'cons': return 'text-red-600';
        case 'unique': return 'text-blue-600';
        case 'restrictions': return 'text-warning';
      }
    };

    return (
      <div className="mb-6">
        <h4 className={cn('flex items-center gap-2 font-semibold mb-3', getIconColor())}>
          <Icon className="w-5 h-5" />
          {title}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {items1.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', getIconColor().replace('text-', 'bg-'))} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {items2.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', getIconColor().replace('text-', 'bg-'))} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-scale-in">
      {/* Header */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[lender1, lender2].map((lender) => (
          <div key={lender.id} className="card-elevated p-6">
            <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm text-white',
                    lender.type === 'Bank' ? 'bg-slate-900' : 'bg-blue-500'
                  )}
                >
                {lender.logo.slice(0, 3)}
                </div>
              <div>
                <h3 className="font-display text-xl font-bold">{lender.name}</h3>
                <span className={cn(
                  'text-sm px-2.5 py-0.5 rounded-full',
                  lender.type === 'Bank' ? 'bg-navy/10 text-navy' : 'bg-trust/10 text-trust'
                )}>
                  {lender.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Est. Sanction</div>
                <div className="font-bold text-lg">Up to ₹{(lender.maxSanctionAmount / 100000).toFixed(0)}L</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">True APR</div>
                <div className="font-bold text-lg">{lender.trueAPR}% – {lender.trueAPRMax}%</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Approval</div>
                <div className={cn(
                  'font-bold text-lg',
                  lender.approvalProbability >= 90 ? 'text-green-600' : lender.approvalProbability >= 80 ? 'text-blue-600' : 'text-red-600'
                )}>
                  {lender.approvalProbability}%
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Disbursal</div>
                <div className="font-bold text-sm">{lender.disbursalTime}</div>
              </div>
            </div>

            <Button 
              onClick={() => onSelectForLetter(lender)}
              className="w-full gradient-primary hover:opacity-90 transition-opacity !rounded-xl"
            >
              Generate Pre-Sanction Letter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ))}
      </div>

      {/* Detailed Comparison */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl font-bold mb-6 text-center">Detailed Comparison</h3>
        
        <Section 
          title="Pros" 
          icon={CheckCircle2} 
          items1={lender1.pros} 
          items2={lender2.pros}
          type="pros"
        />
        
        <Section 
          title="Cons" 
          icon={XCircle} 
          items1={lender1.cons} 
          items2={lender2.cons}
          type="cons"
        />
        
        <Section 
          title="Unique Advantages" 
          icon={Sparkles} 
          items1={lender1.uniqueAdvantages} 
          items2={lender2.uniqueAdvantages}
          type="unique"
        />
        
        <Section 
          title="Restrictions & Conditions" 
          icon={AlertTriangle} 
          items1={lender1.restrictions} 
          items2={lender2.restrictions}
          type="restrictions"
        />
      </div>
    </div>
  );
};
