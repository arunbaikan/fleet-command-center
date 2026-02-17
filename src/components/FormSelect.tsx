import React from 'react';
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const FormSelect = ({ label, value, options, onChange, required, error, placeholder }: FormSelectProps) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      >
        <option value="" disabled>{placeholder || `Select ${label}`}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
};

export default FormSelect;