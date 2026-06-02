import { CalendarDays, TrendingUp, CheckCircle2, Clock, MapPin, Truck, Users } from "lucide-react";
import { Link } from "react-router";
import { useEventStats } from "~/eventflow/hooks/use-events";
import { useEvents } from "~/eventflow/hooks/use-events";
import { useConfigurables } from "~/modules/configurables";
import { StatusBadge } from "~/eventflow/components/status-badge";
import { useAuth } from "~/modules/authentication";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#6B7280]">{label}</p>
        <div className="rounded-lg p-2" style={{ backgroundColor: `${color}18` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-[#1C1C1E]">{value}</p>
    </div>
  );
}

export default function DashboardIndex() {
  const { stats, loading: statsLoading } = useEventStats();
  const { events, loading: eventsLoading } = useEvents();
  const { config, loading: configLoading } = useConfigurables();
  const { user } = useAuth();

  const primaryColor = configLoading ? "#1B4332" : (config.brandColor?.primary ?? "#1B4332");
  const accentColor = configLoading ? "#52B788" : (config.brandColor?.secondary ?? "#52B788");

  const welcomeTitle = configLoading ? "Welcome back" : (config.dashboardWelcomeTitle ?? "Welcome back");
  const welcomeSubtitle = configLoading
    ? "Here's what's happening with your events today."
    : (config.dashboardWelcomeSubtitle ?? "Here's what's happening with your events today.");

  const upcomingEvents = events
    .filter((e) => new Date(e.eventDate) >= new Date() && e.status !== "cancelled")
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 5);

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[#1C1C1E] tracking-tight">
          {welcomeTitle}, {user?.username ?? "Planner"}
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">{welcomeSubtitle}</p>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-[#E5E7EB] bg-white animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Events" value={stats?.total ?? 0} icon={CalendarDays} color={primaryColor} />
          <StatCard label="Upcoming" value={stats?.upcoming ?? 0} icon={TrendingUp} color={accentColor} />
          <StatCard label="Confirmed" value={stats?.confirmed ?? 0} icon={CheckCircle2} color="#16A34A" />
          <StatCard label="In Planning" value={stats?.planning ?? 0} icon={Clock} color="#D97706" />
        </div>
      )}

      {/* Content grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="text-base font-semibold text-[#1C1C1E]">Upcoming Events</h2>
            <Link to="/dashboard/events" className="text-xs font-medium hover:underline" style={{ color: accentColor }}>
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {eventsLoading ? (
              <div className="p-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="mb-3 h-12 rounded-lg bg-gray-50 animate-pulse" />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="mb-2 h-8 w-8 text-[#E5E7EB]" />
                <p className="text-sm text-[#6B7280]">No upcoming events</p>
                <Link
                  to="/dashboard/events"
                  className="mt-2 text-xs font-medium hover:underline"
                  style={{ color: accentColor }}
                >
                  Create your first event
                </Link>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#1C1C1E]">{event.title}</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Access */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="text-base font-semibold text-[#1C1C1E]">Quick Access</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 p-5">
            {[
              { label: "Venues", icon: MapPin, href: "/dashboard/venues", desc: "Manage venue options" },
              { label: "Vendors", icon: Truck, href: "/dashboard/vendors", desc: "Track vendor agreements" },
              { label: "Guests", icon: Users, href: "/dashboard/guests", desc: "Manage guest lists" },
              { label: "Timeline", icon: Clock, href: "/dashboard/timeline", desc: "Build event schedules" },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group flex flex-col gap-2 rounded-xl border border-[#E5E7EB] p-4 transition-all hover:border-[#52B788] hover:shadow-sm"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${primaryColor}12` }}
                >
                  <item.icon className="h-4.5 w-4.5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C1C1E]">{item.label}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      {!eventsLoading && recentEvents.length > 0 && (
        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="text-base font-semibold text-[#1C1C1E]">Recently Updated</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="border-b border-[#F3F4F6] bg-[#F8F9FA]">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Event</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Guests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {recentEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/dashboard/events`}
                        className="text-sm font-medium text-[#1C1C1E] hover:underline"
                      >
                        {event.title}
                      </Link>
                      {event.location && (
                        <p className="mt-0.5 text-xs text-[#6B7280]">{event.location}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">
                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#6B7280]">
                      {event.guestCount ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
