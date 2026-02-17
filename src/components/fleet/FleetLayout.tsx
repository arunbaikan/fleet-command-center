import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, UserPlus, List, Wallet, Skull, Settings, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { partnerProfile } from "@/lib/mockData";
import { useState } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/loan-application", icon: UserPlus, label: "New Lead" },
  { to: "/leads", icon: List, label: "Lead Tracker" },
  { to: "/wallet", icon: Wallet, label: "Wallet & Payouts" },
];

const FleetLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-200",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient shadow-lg">
            <Skull className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">
              Happirate <span className="gold-text">Fleet</span>
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Partner Portal</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {/* {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px]", isActive && "drop-shadow-[0_0_8px_hsl(42_92%_56%/0.4)]")} />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
              </NavLink>
            );
          })} */}
          {navItems.map((item) => {
  const isActive = location.pathname === item.to;

  const handleClick = () => {
    if (item.to === "/loan-application") {
      sessionStorage.removeItem("mobile_number");
    }
    setSidebarOpen(false);
  };

  return (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <item.icon
        className={cn(
          "h-[18px] w-[18px]",
          isActive && "drop-shadow-[0_0_8px_hsl(42_92%_56%/0.4)]"
        )}
      />
      {item.label}
      {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
    </NavLink>
  );
})}

        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-2">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen w-full">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-4 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <h2 className="text-lg font-bold text-foreground">
              {navItems.find((n) => n.to === location.pathname)?.label || "Fleet"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{partnerProfile.name}</p>
              <p className="text-xs text-muted-foreground">{partnerProfile.partnerId} · <span className="text-primary font-medium">{partnerProfile.tier}</span></p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient text-sm font-bold text-primary-foreground shadow">
              {partnerProfile.name.split(" ").map(n => n[0]).join("")}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FleetLayout;
