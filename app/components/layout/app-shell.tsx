import { Link, useLocation, Form } from "react-router";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Truck,
  Clock,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  featureFlag?: keyof ReturnType<typeof useConfigurables>["config"];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Events", href: "/dashboard/events", icon: CalendarDays },
  { label: "Venues", href: "/dashboard/venues", icon: MapPin, featureFlag: "enableVenueManagement" },
  { label: "Vendors", href: "/dashboard/vendors", icon: Truck, featureFlag: "enableVendorTracking" },
  { label: "Guests", href: "/dashboard/guests", icon: Users, featureFlag: "enableGuestManagement" },
  { label: "Timeline", href: "/dashboard/timeline", icon: Clock, featureFlag: "enableTimelineManagement" },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { config, loading } = useConfigurables();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const appName = loading ? "EventFlow" : (config.appName ?? "EventFlow");
  const primaryColor = loading ? "#1B4332" : (config.brandColor?.primary ?? "#1B4332");
  const accentColor = loading ? "#52B788" : (config.brandColor?.secondary ?? "#52B788");

  const visibleNav = navItems.filter((item) => {
    if (!item.featureFlag) return true;
    const flag = config[item.featureFlag as keyof typeof config];
    return flag !== false;
  });

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: primaryColor }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            {!loading && config.logoUrl && config.logoUrl !== "FILL_LOGO_URL_HERE" ? (
              <img src={config.logoUrl} alt={appName} className="h-8 w-8 rounded object-cover" />
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {appName.charAt(0)}
              </div>
            )}
            <span className="text-base font-semibold text-white tracking-tight">{appName}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {visibleNav.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
                style={isActive ? { backgroundColor: accentColor } : undefined}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {user?.username?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username ?? "Planner"}</p>
              <p className="text-xs text-white/50 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <Form method="post" action="/auth/logout">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </Form>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-[#E5E7EB] bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#1C1C1E] hover:text-[#1B4332]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-base font-semibold text-[#1C1C1E]">{appName}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
