import React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  [key: string]: any;
}

const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  disabled,
  error,
  hint,
  ...props
}: FormInputProps) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border bg-background px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2",
          error ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20",
          disabled && "bg-muted cursor-not-allowed opacity-70"
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      {hint && !error && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
};

export default FormInput;