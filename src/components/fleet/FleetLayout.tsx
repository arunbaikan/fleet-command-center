import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import { Skull } from "lucide-react";

const FleetLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient">
              <Skull className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">
                Happirate <span className="gold-text">Fleet</span>
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wide uppercase">Partner Portal</p>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
            AM
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-lg px-4 pb-24 pt-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};

export default FleetLayout;
