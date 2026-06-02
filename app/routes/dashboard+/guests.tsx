import { useState } from "react";
import { Users, Plus, Pencil, Trash2, Search, ChevronDown, CalendarDays } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useGuests } from "~/eventflow/hooks/use-guests";
import { useEvents } from "~/eventflow/hooks/use-events";
import { GuestFormDialog } from "~/eventflow/components/guest-form-dialog";
import { StatusBadge } from "~/eventflow/components/status-badge";
import { EmptyState } from "~/eventflow/components/empty-state";
import { PageHeader } from "~/eventflow/components/page-header";
import type { Guest } from "~/eventflow/hooks/use-guests";

function GuestList({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const { guests, loading, createGuest, updateGuest, deleteGuest } = useGuests(eventId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Guest | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = guests.filter((g) =>
    `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (g.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const confirmed = guests.filter((g) => g.rsvpStatus === "confirmed").length;
  const pending = guests.filter((g) => g.rsvpStatus === "pending").length;

  const handleSubmit = async (data: Partial<Guest> & { eventId: string }) => {
    if (editTarget) await updateGuest(editTarget._id, data);
    else await createGuest(data);
  };

  const handleDelete = async (id: string) => {
    await deleteGuest(id);
    setConfirmDelete(null);
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#1C1C1E]">{eventTitle}</h3>
          <p className="text-xs text-[#6B7280]">
            {guests.length} guests · {confirmed} confirmed · {pending} pending
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" />
            <Input className="pl-8 h-8 text-sm w-48" placeholder="Search guests..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button
            size="sm"
            onClick={() => { setEditTarget(null); setDialogOpen(true); }}
            style={{ backgroundColor: "#1B4332", color: "white" }}
            className="hover:opacity-90 gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Guest
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="p-5 space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-gray-50 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm text-[#6B7280]">{search ? "No guests match your search" : "No guests added yet"}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F8F9FA]">
                <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Guest</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">RSVP</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">+1s</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Table</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Dietary</th>
                <th className="px-5 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filtered.map((guest) => (
                <tr key={guest._id} className="hover:bg-[#F8F9FA] transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-[#1C1C1E]">{guest.firstName} {guest.lastName}</p>
                    {guest.email && <p className="mt-0.5 text-xs text-[#6B7280]">{guest.email}</p>}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={guest.rsvpStatus} /></td>
                  <td className="px-5 py-3 text-sm text-[#6B7280]">{guest.plusOnes ?? 0}</td>
                  <td className="px-5 py-3 text-sm text-[#6B7280]">{guest.tableNumber ?? "—"}</td>
                  <td className="px-5 py-3 text-sm text-[#6B7280] max-w-[140px] truncate">{guest.dietaryRequirements ?? "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditTarget(guest); setDialogOpen(true); }} className="rounded-md p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1C1C1E] transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setConfirmDelete(guest._id)} className="rounded-md p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GuestFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget ?? undefined}
        mode={editTarget ? "edit" : "create"}
        eventId={eventId}
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-[#1C1C1E]">Remove Guest</h3>
            <p className="mt-2 text-sm text-[#6B7280]">Are you sure you want to remove this guest?</p>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={() => handleDelete(confirmDelete)}>Remove</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuestsPage() {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const activeEvents = events.filter((e) => e.status !== "cancelled");
  const displayEvents = selectedEvent === "all" ? activeEvents : activeEvents.filter((e) => e._id === selectedEvent);

  return (
    <div>
      <PageHeader
        title="Guest Lists"
        description="Manage attendees, RSVPs, seating, and dietary requirements."
      />

      {/* Event filter */}
      {!eventsLoading && activeEvents.length > 1 && (
        <div className="mb-5 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedEvent("all")}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
              selectedEvent === "all"
                ? "border-[#1B4332] bg-[#1B4332] text-white"
                : "border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#1C1C1E]"
            }`}
          >
            All Events
          </button>
          {activeEvents.map((event) => (
            <button
              key={event._id}
              onClick={() => setSelectedEvent(event._id)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                selectedEvent === event._id
                  ? "border-[#1B4332] bg-[#1B4332] text-white"
                  : "border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#1C1C1E]"
              }`}
            >
              {event.title}
            </button>
          ))}
        </div>
      )}

      {eventsLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => <div key={i} className="h-48 rounded-xl border border-[#E5E7EB] bg-white animate-pulse" />)}
        </div>
      ) : activeEvents.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No active events"
          description="Create an event first to start managing your guest list."
          action={
            <Button asChild style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90">
              <a href="/dashboard/events">Go to Events</a>
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          {displayEvents.map((event) => (
            <GuestList key={event._id} eventId={event._id} eventTitle={event.title} />
          ))}
        </div>
      )}
    </div>
  );
}
