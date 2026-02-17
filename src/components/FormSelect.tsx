import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  required,
  error,
  placeholder = "Select an option"
}: FormSelectProps) => {
  return (
    <div className="space-y-2">
      <Label className={cn("text-sm font-medium", error && "text-destructive")}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(
          "h-11 bg-background border-input focus:ring-2 focus:ring-primary/20",
          error && "border-destructive focus:ring-destructive/20"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
};

export default FormSelect;