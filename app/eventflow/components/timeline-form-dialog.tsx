import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { TimelineItem } from "../hooks/use-timeline";

interface TimelineFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TimelineItem> & { eventId: string }) => Promise<void>;
  initial?: Partial<TimelineItem>;
  mode?: "create" | "edit";
  eventId: string;
}

const typeOptions = [
  { value: "setup", label: "Setup" },
  { value: "ceremony", label: "Ceremony" },
  { value: "reception", label: "Reception" },
  { value: "meal", label: "Meal" },
  { value: "entertainment", label: "Entertainment" },
  { value: "speech", label: "Speech" },
  { value: "break", label: "Break" },
  { value: "departure", label: "Departure" },
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "skipped", label: "Skipped" },
];

export function TimelineFormDialog({ open, onClose, onSubmit, initial, mode = "create", eventId }: TimelineFormDialogProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startTime, setStartTime] = useState(initial?.startTime ?? "");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "");
  const [type, setType] = useState(initial?.type ?? "other");
  const [status, setStatus] = useState(initial?.status ?? "pending");
  const [assignedTo, setAssignedTo] = useState(initial?.assignedTo ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !startTime) { setError("Title and start time are required."); return; }
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        startTime,
        endTime: endTime || undefined,
        type,
        status,
        assignedTo: assignedTo.trim() || undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        eventId,
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
          <DialogTitle>{mode === "create" ? "Add Timeline Item" : "Edit Timeline Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="space-y-1.5">
            <Label htmlFor="tl-title">Title *</Label>
            <Input id="tl-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ceremony begins" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tl-start">Start Time *</Label>
              <Input id="tl-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tl-end">End Time</Label>
              <Input id="tl-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{typeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tl-assigned">Assigned To</Label>
              <Input id="tl-assigned" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Coordinator name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tl-location">Location</Label>
              <Input id="tl-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Main hall" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tl-description">Description</Label>
            <Textarea id="tl-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tl-notes">Notes</Label>
            <Textarea id="tl-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes..." rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90">
              {loading ? "Saving…" : mode === "create" ? "Add Item" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
