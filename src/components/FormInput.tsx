import React from 'react';
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  onChange?: (value: string) => void;
}

const FormInput = ({ label, error, hint, onChange, className, ...props }: FormInputProps) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {props.required && <span className="text-destructive">*</span>}
      </label>
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {hint && !error && <p className="text-[10px] text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
};

export default FormInput;