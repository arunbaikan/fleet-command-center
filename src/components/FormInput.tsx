import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  onChange?: (value: string) => void;
}

const FormInput = ({ label, error, hint, onChange, className, ...props }: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label className={cn(error && "text-destructive")}>{label}</Label>
      <Input 
        {...props}
        className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};

export default FormInput;