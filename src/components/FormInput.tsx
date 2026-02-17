import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  hint?: string;
  placeholder?: string;
  max?: string;
  step?: string;
}

const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  error,
  disabled,
  hint,
  placeholder,
  max,
  step
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label className={cn("text-sm font-medium", error && "text-destructive")}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        max={max}
        step={step}
        className={cn(
          "h-11 bg-background border-input focus:ring-2 focus:ring-primary/20",
          error && "border-destructive focus:ring-destructive/20"
        )}
      />
      {hint && !error && <p className="text-[10px] text-muted-foreground italic">{hint}</p>}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
};

export default FormInput;