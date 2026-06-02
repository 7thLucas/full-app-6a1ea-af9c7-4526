import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Event } from "../hooks/use-events";

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Event>) => Promise<void>;
  initial?: Partial<Event>;
  mode?: "create" | "edit";
}

const statusOptions = [
  { value: "planning", label: "Planning" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function EventFormDialog({ open, onClose, onSubmit, initial, mode = "create" }: EventFormDialogProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState(initial?.status ?? "planning");
  const [eventDate, setEventDate] = useState(
    initial?.eventDate ? initial.eventDate.slice(0, 10) : ""
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [budget, setBudget] = useState(initial?.budget?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !eventDate) {
      setError("Title and event date are required.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        eventDate,
        location: location.trim() || undefined,
        budget: budget ? parseFloat(budget) : undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Event" : "Edit Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="ef-title">Event Name *</Label>
            <Input
              id="ef-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summer Gala 2026"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ef-date">Event Date *</Label>
              <Input
                id="ef-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ef-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="ef-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ef-location">Location</Label>
            <Input
              id="ef-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Grand Ballroom, New York"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ef-budget">Budget ($)</Label>
            <Input
              id="ef-budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="15000"
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ef-description">Description</Label>
            <Textarea
              id="ef-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the event"
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ef-notes">Notes</Label>
            <Textarea
              id="ef-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes..."
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#1B4332", color: "white" }}
              className="hover:opacity-90"
            >
              {loading ? "Saving…" : mode === "create" ? "Create Event" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
