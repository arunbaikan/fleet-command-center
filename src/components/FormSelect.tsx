import React from "react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  required,
  error,
}: FormSelectProps) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-xl border bg-background px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 appearance-none",
          error ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20"
        )}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
};

export default FormSelect;