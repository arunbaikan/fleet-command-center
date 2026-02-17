import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
}

const Loader = ({ size = 24 }: LoaderProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={size} />
    </div>
  );
};

export default Loader;