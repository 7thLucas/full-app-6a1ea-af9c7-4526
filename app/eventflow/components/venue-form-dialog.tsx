import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Venue } from "../hooks/use-venues";

interface VenueFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Venue>) => Promise<void>;
  initial?: Partial<Venue>;
  mode?: "create" | "edit";
  eventId?: string;
}

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "confirmed", label: "Confirmed" },
  { value: "unavailable", label: "Unavailable" },
];

export function VenueFormDialog({ open, onClose, onSubmit, initial, mode = "create", eventId }: VenueFormDialogProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [capacity, setCapacity] = useState(initial?.capacity?.toString() ?? "");
  const [status, setStatus] = useState(initial?.status ?? "available");
  const [contactName, setContactName] = useState(initial?.contactName ?? "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initial?.contactPhone ?? "");
  const [pricePerDay, setPricePerDay] = useState(initial?.pricePerDay?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Venue name is required."); return; }
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        address: address.trim() || undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
        status,
        contactName: contactName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : undefined,
        notes: notes.trim() || undefined,
        eventId: eventId ?? initial?.eventId,
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
          <DialogTitle>{mode === "create" ? "Add Venue" : "Edit Venue"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="space-y-1.5">
            <Label htmlFor="v-name">Venue Name *</Label>
            <Input id="v-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="The Grand Hall" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-address">Address</Label>
            <Input id="v-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, New York, NY" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="v-capacity">Capacity</Label>
              <Input id="v-capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="300" min="0" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="v-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="v-contact">Contact Name</Label>
              <Input id="v-contact" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Jane Smith" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-price">Price Per Day ($)</Label>
              <Input id="v-price" type="number" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} placeholder="2500" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="v-email">Contact Email</Label>
              <Input id="v-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="venue@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-phone">Contact Phone</Label>
              <Input id="v-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+1 555-0100" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-notes">Notes</Label>
            <Textarea id="v-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Parking available, catering kitchen included..." rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90">
              {loading ? "Saving…" : mode === "create" ? "Add Venue" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
