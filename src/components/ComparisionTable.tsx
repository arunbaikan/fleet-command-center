import { Lender } from '@/Data/lenders';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, TrendingUp, Clock, CreditCard, Percent, Calendar, AlertCircle, Banknote } from 'lucide-react';
import React from 'react';

interface ComparisonTableProps {
  lenders: Lender[];
  selectedLenders: string[];
  onSelectLender: (id: string) => void;
  onApplyNow?: (lender: Lender) => void;
}

export const ComparisonTable = ({ lenders, selectedLenders, onSelectLender, onApplyNow }: ComparisonTableProps) => {
const isDisabled = (id) => {
  return selectedLenders.length >= 2 && !selectedLenders.includes(id);
};

  const getApprovalColor = (probability: number) => {
    if (probability >= 90) return 'text-approval font-semibold';
    if (probability >= 80) return 'text-trust font-semibold';
    return 'text-warning font-semibold';
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-violet-300 shadow-sm">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gradient-to-r from-[#140c24] to-[#1f1338] text-white">
        <th className="sticky left-0 bg-[#140c24] z-10 px-4 py-4 text-left font-semibold rounded-tl-2xl">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Select
          </div>
        </th>

        <th className="px-4 py-4 text-left font-semibold">Lender</th>

        <th className="px-4 py-4 text-left font-semibold">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Max Amount
          </div>
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            True APR
          </div>
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Tenure
          </div>
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Processing Fee
          </div>
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Approval
          </div>
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            Pre-Payment
          </div>
        </th>

        <th className="px-4 py-4 text-left font-semibold">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Disbursal
          </div>
        </th>

        <th className="px-4 py-4 text-left font-semibold rounded-tr-2xl">
          Action
        </th>
      </tr>
    </thead>

    <tbody>
      {lenders.map((lender) => (
        <tr
            key={lender.id}
            onClick={() => !isDisabled(lender.id) && onSelectLender(lender.id)}
            className={cn(
              'border-b last:border-b-0 transition-all cursor-pointer',
              selectedLenders.includes(lender.id) && 'bg-violet-50',
              isDisabled(lender.id)
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-gray-50'
            )}
          >

          {/* Select */}
          <td className="sticky left-0 bg-white px-4 py-4">
            <div
              className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center',
                selectedLenders.includes(lender.id)
                  ? 'bg-violet-500 border-violet-500'
                  : isDisabled(lender.id)
                  ? 'border-gray-300'
                  : 'border-gray-400'
              )}
            >
              {selectedLenders.includes(lender.id) && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
          </td>

          {/* Lender */}
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs',
                  lender.type === 'Bank'
                    ? 'bg-gray-900'
                    : 'bg-blue-500'
                )}
              >
                {lender.logo.slice(0, 3)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {lender.name}
                </div>
                <div className="text-xs text-gray-500">
                  {lender.type}
                </div>
              </div>
            </div>
          </td>

          <td className="px-4 py-4 font-medium">
            Up to ₹{(lender.maxSanctionAmount / 100000).toFixed(0)}L
          </td>

          <td className="px-4 py-4 font-medium">
            {lender.trueAPR}% – {lender.trueAPRMax}%
          </td>

          <td className="px-4 py-4">{lender.tenureOptions}</td>

          <td className="px-4 py-4">
            {lender.processingFeeMin}% – {lender.processingFeeMax}%
          </td>

          <td
            className={cn(
              'px-4 py-4 font-semibold',
              lender.approvalProbability >= 90
                ? 'text-green-600'
                : lender.approvalProbability >= 80
                ? 'text-blue-600'
                : 'text-orange-500'
            )}
          >
            {lender.approvalProbability}%
          </td>

          <td className="px-4 py-4 text-sm">
            {lender.prepaymentCharges}
          </td>

          <td className="px-4 py-4">
            {lender.disbursalTime}
          </td>

          {/* Action */}
          <td className="px-4 py-4">
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
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};
