import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 24 }: { size?: number }) => {
  return <Loader2 className="animate-spin text-primary" size={size} />;
};

export default Loader;