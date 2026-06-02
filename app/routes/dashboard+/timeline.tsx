import { useState } from "react";
import { Clock, Plus, Pencil, Trash2, CheckCircle2, Circle, AlertCircle, CalendarDays } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTimeline } from "~/eventflow/hooks/use-timeline";
import { useEvents } from "~/eventflow/hooks/use-events";
import { TimelineFormDialog } from "~/eventflow/components/timeline-form-dialog";
import { StatusBadge } from "~/eventflow/components/status-badge";
import { EmptyState } from "~/eventflow/components/empty-state";
import { PageHeader } from "~/eventflow/components/page-header";
import type { TimelineItem } from "~/eventflow/hooks/use-timeline";

const typeColors: Record<string, string> = {
  setup: "#6366F1",
  ceremony: "#1B4332",
  reception: "#52B788",
  meal: "#D97706",
  entertainment: "#7C3AED",
  speech: "#0891B2",
  break: "#6B7280",
  departure: "#DC2626",
  other: "#4B5563",
};

const typeLabels: Record<string, string> = {
  setup: "Setup",
  ceremony: "Ceremony",
  reception: "Reception",
  meal: "Meal",
  entertainment: "Entertainment",
  speech: "Speech",
  break: "Break",
  departure: "Departure",
  other: "Other",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "in_progress") return <AlertCircle className="h-4 w-4 text-amber-500" />;
  return <Circle className="h-4 w-4 text-[#E5E7EB]" />;
}

function EventTimeline({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const { items, loading, createItem, updateItem, deleteItem } = useTimeline(eventId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TimelineItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const completed = items.filter((i) => i.status === "completed").length;

  const handleSubmit = async (data: Partial<TimelineItem> & { eventId: string }) => {
    if (editTarget) await updateItem(editTarget._id, data);
    else await createItem(data);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setConfirmDelete(null);
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#1C1C1E]">{eventTitle}</h3>
          <p className="text-xs text-[#6B7280]">
            {items.length} items · {completed} completed
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => { setEditTarget(null); setDialogOpen(true); }}
          style={{ backgroundColor: "#1B4332", color: "white" }}
          className="hover:opacity-90 gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Add Item
        </Button>
      </div>

      {loading ? (
        <div className="p-5 space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-lg bg-gray-50 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm text-[#6B7280]">No timeline items yet</p>
          <button
            onClick={() => { setEditTarget(null); setDialogOpen(true); }}
            className="mt-2 text-xs font-medium text-[#52B788] hover:underline"
          >
            Add your first item
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#F3F4F6]">
          {items.map((item, idx) => (
            <div key={item._id} className="flex items-start gap-4 px-5 py-4 hover:bg-[#F8F9FA] transition-colors">
              <div className="flex flex-col items-center pt-0.5">
                <StatusIcon status={item.status} />
                {idx < items.length - 1 && <div className="mt-1 h-8 w-px bg-[#E5E7EB]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="rounded-md px-1.5 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: typeColors[item.type] ?? "#4B5563" }}
                      >
                        {typeLabels[item.type] ?? item.type}
                      </span>
                      <p className="text-sm font-medium text-[#1C1C1E]">{item.title}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.startTime}{item.endTime ? ` – ${item.endTime}` : ""}
                      </span>
                      {item.location && <span>{item.location}</span>}
                      {item.assignedTo && <span>Assigned: {item.assignedTo}</span>}
                    </div>
                    {item.description && <p className="mt-1 text-xs text-[#6B7280]">{item.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={item.status} />
                    <button onClick={() => { setEditTarget(item); setDialogOpen(true); }} className="rounded-md p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1C1C1E] transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setConfirmDelete(item._id)} className="rounded-md p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TimelineFormDialog
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
            <h3 className="text-base font-semibold text-[#1C1C1E]">Delete Timeline Item</h3>
            <p className="mt-2 text-sm text-[#6B7280]">Are you sure you want to delete this item?</p>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={() => handleDelete(confirmDelete)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TimelinePage() {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const activeEvents = events.filter((e) => e.status !== "cancelled");
  const displayEvents = selectedEvent === "all" ? activeEvents : activeEvents.filter((e) => e._id === selectedEvent);

  return (
    <div>
      <PageHeader
        title="Timeline"
        description="Build and track event day schedules, milestones, and deadlines."
      />

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
          icon={<Clock className="h-6 w-6" />}
          title="No active events"
          description="Create an event first to start building timelines."
          action={
            <Button asChild style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90">
              <a href="/dashboard/events">Go to Events</a>
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          {displayEvents.map((event) => (
            <EventTimeline key={event._id} eventId={event._id} eventTitle={event.title} />
          ))}
        </div>
      )}
    </div>
  );
}
