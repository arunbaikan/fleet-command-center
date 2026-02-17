import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-10" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background",
                currentStep > step.id ? "bg-primary border-primary text-primary-foreground" :
                currentStep === step.id ? "border-primary text-primary ring-4 ring-primary/10" :
                "border-muted text-muted-foreground"
              )}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <span className={cn(
              "text-[10px] md:text-xs font-medium max-w-[80px] text-center hidden sm:block",
              currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
            )}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;