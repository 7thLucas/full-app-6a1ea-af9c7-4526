import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Vendor } from "../hooks/use-vendors";

interface VendorFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Vendor>) => Promise<void>;
  initial?: Partial<Vendor>;
  mode?: "create" | "edit";
  eventId?: string;
}

const categoryOptions = [
  { value: "catering", label: "Catering" },
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Videography" },
  { value: "music", label: "Music" },
  { value: "florals", label: "Florals" },
  { value: "decor", label: "Decor" },
  { value: "transportation", label: "Transportation" },
  { value: "security", label: "Security" },
  { value: "lighting", label: "Lighting" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "prospecting", label: "Prospecting" },
  { value: "contacted", label: "Contacted" },
  { value: "negotiating", label: "Negotiating" },
  { value: "booked", label: "Booked" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentOptions = [
  { value: "unpaid", label: "Unpaid" },
  { value: "deposit_paid", label: "Deposit Paid" },
  { value: "partially_paid", label: "Partially Paid" },
  { value: "paid", label: "Paid" },
];

export function VendorFormDialog({ open, onClose, onSubmit, initial, mode = "create", eventId }: VendorFormDialogProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "other");
  const [status, setStatus] = useState(initial?.status ?? "prospecting");
  const [paymentStatus, setPaymentStatus] = useState(initial?.paymentStatus ?? "unpaid");
  const [contactName, setContactName] = useState(initial?.contactName ?? "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initial?.contactPhone ?? "");
  const [contractAmount, setContractAmount] = useState(initial?.contractAmount?.toString() ?? "");
  const [depositAmount, setDepositAmount] = useState(initial?.depositAmount?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Vendor name is required."); return; }
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        status,
        paymentStatus,
        contactName: contactName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        contractAmount: contractAmount ? parseFloat(contractAmount) : undefined,
        depositAmount: depositAmount ? parseFloat(depositAmount) : undefined,
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
          <DialogTitle>{mode === "create" ? "Add Vendor" : "Edit Vendor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="space-y-1.5">
            <Label htmlFor="vd-name">Vendor Name *</Label>
            <Input id="vd-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Blossom Floral Studio" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categoryOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
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
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{paymentOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vd-contact">Contact Name</Label>
              <Input id="vd-contact" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="John Doe" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="vd-contract">Contract Amount ($)</Label>
              <Input id="vd-contract" type="number" value={contractAmount} onChange={(e) => setContractAmount(e.target.value)} placeholder="5000" min="0" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vd-deposit">Deposit Amount ($)</Label>
              <Input id="vd-deposit" type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="1500" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="vd-email">Email</Label>
              <Input id="vd-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="vendor@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vd-phone">Phone</Label>
              <Input id="vd-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+1 555-0200" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vd-notes">Notes</Label>
            <Textarea id="vd-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contract details, special requirements..." rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90">
              {loading ? "Saving…" : mode === "create" ? "Add Vendor" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
