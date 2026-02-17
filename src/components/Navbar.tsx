import React from 'react';
import { Skull } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center px-6">
      <div className="flex items-center gap-2">
        <Skull className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">Happirate Fleet</span>
      </div>
    </div>
  );
};

export default Navbar;