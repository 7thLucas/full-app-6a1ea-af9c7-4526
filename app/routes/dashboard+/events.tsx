import { useState } from "react";
import { CalendarDays, Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useEvents } from "~/eventflow/hooks/use-events";
import { EventFormDialog } from "~/eventflow/components/event-form-dialog";
import { StatusBadge } from "~/eventflow/components/status-badge";
import { EmptyState } from "~/eventflow/components/empty-state";
import { PageHeader } from "~/eventflow/components/page-header";
import type { Event } from "~/eventflow/hooks/use-events";

export default function EventsPage() {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Event | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (event: Event) => { setEditTarget(event); setDialogOpen(true); };

  const handleSubmit = async (data: Partial<Event>) => {
    if (editTarget) {
      await updateEvent(editTarget._id, data);
    } else {
      await createEvent(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Events"
        description="Manage all your events in one place."
        action={
          <Button
            onClick={openCreate}
            style={{ backgroundColor: "#1B4332", color: "white" }}
            className="hover:opacity-90 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-5 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        <Input
          className="pl-9"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl border border-[#E5E7EB] bg-white animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-6 w-6" />}
          title={search ? "No events found" : "No events yet"}
          description={
            search
              ? "Try a different search term."
              : "Create your first event to get started managing your event portfolio."
          }
          action={
            !search ? (
              <Button onClick={openCreate} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90 gap-1.5">
                <Plus className="h-4 w-4" /> New Event
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Event</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Guests</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Budget</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map((event) => (
                  <tr key={event._id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#1C1C1E]">{event.title}</p>
                      {event.location && (
                        <p className="mt-0.5 text-xs text-[#6B7280]">{event.location}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6B7280]">
                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6B7280]">
                      {event.guestCount ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6B7280]">
                      {event.budget ? `$${event.budget.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(event)}
                          className="rounded-md p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1C1C1E] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(event._id)}
                          className="rounded-md p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EventFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget ?? undefined}
        mode={editTarget ? "edit" : "create"}
      />

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-[#1C1C1E]">Delete Event</h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              This will permanently delete the event and all its data. This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
