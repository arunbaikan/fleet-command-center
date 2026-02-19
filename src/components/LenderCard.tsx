import { Lender } from '@/Data/lenders';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Clock, Percent, CreditCard, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import React from 'react';

interface LenderCardProps {
  lender: Lender;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
  onApplyNow?: (lender: Lender) => void;
}

export const LenderCard = ({ lender, isSelected, onSelect, disabled, onApplyNow }) => {
  const getApprovalColor = (probability) => {
    if (probability >= 90) return 'text-green-600';
    if (probability >= 80) return 'text-blue-600';
    return 'text-orange-500';
  };

  const getApprovalBadge = (probability) => {
    if (probability >= 90) return 'bg-green-100 text-green-700';
    if (probability >= 80) return 'bg-blue-100 text-blue-700';
    return 'bg-orange-100 text-orange-700';
  };
  console.log("Lender in card", lender);
  return (
      <div
        className={cn(
          'bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm cursor-pointer transition-all duration-300',
          'hover:border-violet-400 hover:shadow-[0_0_12px_rgba(139,92,246,0.25)]',
          isSelected && 'border-violet-500 shadow-[0_0_0_2px_rgba(139,92,246,0.3)]',
          disabled && !isSelected && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && onSelect(lender.id)}
      >

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white',
              lender.type === 'Bank' ? 'bg-gray-900' : 'bg-blue-500'
            )}
          >
            {lender.logo.slice(0, 4)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{lender.name}</h3>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                lender.type === 'Bank'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-blue-100 text-blue-600'
              )}
            >
              {lender.type}
            </span>
          </div>
        </div>

        {/* Select circle */}
        <div
          className={cn(
            'w-6 h-6 rounded-full border flex items-center justify-center',
            isSelected
              ? 'bg-violet-500 border-violet-500'
              : 'border-gray-300'
          )}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            Est. Sanction
          </div>
          <div className="font-semibold text-gray-900">
            {/* Up to ₹{lender.maxSanctionAmount}L */}
            Up to ₹{(lender.maxSanctionAmount / 100000).toFixed(2)}L
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
            <Percent className="w-3.5 h-3.5" />
            Interest Rate
          </div>
          <div className="font-semibold text-gray-900 mt-3 ml-2">
            {lender.trueAPR}%
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            Tenure
          </span>
          <span className="font-medium text-gray-900">
            {lender.tenureOptions}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <AlertCircle className="w-3.5 h-3.5" />
            Processing Fee
          </span>
          <span className="font-medium text-gray-900">
            {/* {lender.processingFeeMin}% – {lender.processingFeeMax}% */}
            {lender.processingFee}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <TrendingUp className="w-3.5 h-3.5" />
            Approval
          </span>
          <span className={cn('font-semibold', getApprovalColor(lender.approvalProbability))}>
            {lender.approvalProbability}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            Disbursal
          </span>
          <span className="font-medium text-gray-900">
            {lender.disbursalTime}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full',
            getApprovalBadge(lender.approvalProbability)
          )}
        >
          {lender.approvalProbability >= 90
            ? 'High Approval'
            : lender.approvalProbability >= 80
            ? 'Good Match'
            : 'Fair Match'}
        </span>

        {onApplyNow && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onApplyNow(lender);
            }}
            className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl px-4"
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
};
