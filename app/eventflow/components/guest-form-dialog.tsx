import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Guest } from "../hooks/use-guests";

interface GuestFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Guest> & { eventId: string }) => Promise<void>;
  initial?: Partial<Guest>;
  mode?: "create" | "edit";
  eventId: string;
}

const rsvpOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
  { value: "waitlisted", label: "Waitlisted" },
];

export function GuestFormDialog({ open, onClose, onSubmit, initial, mode = "create", eventId }: GuestFormDialogProps) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [rsvpStatus, setRsvpStatus] = useState(initial?.rsvpStatus ?? "pending");
  const [plusOnes, setPlusOnes] = useState(initial?.plusOnes?.toString() ?? "0");
  const [dietaryRequirements, setDietaryRequirements] = useState(initial?.dietaryRequirements ?? "");
  const [tableNumber, setTableNumber] = useState(initial?.tableNumber ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) { setError("First name and last name are required."); return; }
    setLoading(true);
    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        rsvpStatus,
        plusOnes: parseInt(plusOnes) || 0,
        dietaryRequirements: dietaryRequirements.trim() || undefined,
        tableNumber: tableNumber.trim() || undefined,
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
          <DialogTitle>{mode === "create" ? "Add Guest" : "Edit Guest"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="g-first">First Name *</Label>
              <Input id="g-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Sarah" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-last">Last Name *</Label>
              <Input id="g-last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Johnson" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="g-email">Email</Label>
              <Input id="g-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sarah@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-phone">Phone</Label>
              <Input id="g-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-0300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>RSVP Status</Label>
              <Select value={rsvpStatus} onValueChange={setRsvpStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{rsvpOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-plus">Plus Ones</Label>
              <Input id="g-plus" type="number" value={plusOnes} onChange={(e) => setPlusOnes(e.target.value)} min="0" max="10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="g-table">Table Number</Label>
              <Input id="g-table" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="Table 12" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-dietary">Dietary Requirements</Label>
              <Input id="g-dietary" value={dietaryRequirements} onChange={(e) => setDietaryRequirements(e.target.value)} placeholder="Vegan, gluten-free..." />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-notes">Notes</Label>
            <Textarea id="g-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special notes..." rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90">
              {loading ? "Saving…" : mode === "create" ? "Add Guest" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
