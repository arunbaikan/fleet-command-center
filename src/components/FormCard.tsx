import React from 'react';

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const FormCard = ({ title, subtitle, children }: FormCardProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default FormCard;