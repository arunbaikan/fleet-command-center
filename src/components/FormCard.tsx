import React from "react";
import { motion } from "framer-motion";

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const FormCard = ({ title, subtitle, children }: FormCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-border bg-secondary/10">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default FormCard;