import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Search, Users, DollarSign } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useVenues } from "~/eventflow/hooks/use-venues";
import { VenueFormDialog } from "~/eventflow/components/venue-form-dialog";
import { StatusBadge } from "~/eventflow/components/status-badge";
import { EmptyState } from "~/eventflow/components/empty-state";
import { PageHeader } from "~/eventflow/components/page-header";
import type { Venue } from "~/eventflow/hooks/use-venues";

export default function VenuesPage() {
  const { venues, loading, createVenue, updateVenue, deleteVenue } = useVenues();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Venue | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.address ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (venue: Venue) => { setEditTarget(venue); setDialogOpen(true); };

  const handleSubmit = async (data: Partial<Venue>) => {
    if (editTarget) await updateVenue(editTarget._id, data);
    else await createVenue(data);
  };

  const handleDelete = async (id: string) => {
    await deleteVenue(id);
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Venues"
        description="Track and manage your venue options and contacts."
        action={
          <Button onClick={openCreate} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90 gap-1.5">
            <Plus className="h-4 w-4" /> Add Venue
          </Button>
        }
      />

      <div className="mb-5 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        <Input className="pl-9" placeholder="Search venues..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-xl border border-[#E5E7EB] bg-white animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title={search ? "No venues found" : "No venues yet"}
          description={search ? "Try a different search term." : "Add your first venue to start tracking options and contacts."}
          action={
            !search ? (
              <Button onClick={openCreate} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90 gap-1.5">
                <Plus className="h-4 w-4" /> Add Venue
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((venue) => (
            <div key={venue._id} className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#1C1C1E] truncate">{venue.name}</h3>
                  {venue.address && <p className="mt-0.5 text-xs text-[#6B7280] truncate">{venue.address}</p>}
                </div>
                <StatusBadge status={venue.status} />
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                {venue.capacity && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {venue.capacity.toLocaleString()} capacity
                  </span>
                )}
                {venue.pricePerDay && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" /> ${venue.pricePerDay.toLocaleString()}/day
                  </span>
                )}
              </div>
              {venue.contactName && (
                <div className="text-xs text-[#6B7280]">
                  <span className="font-medium text-[#1C1C1E]">Contact:</span> {venue.contactName}
                  {venue.contactEmail && ` · ${venue.contactEmail}`}
                </div>
              )}
              {venue.notes && <p className="text-xs text-[#6B7280] line-clamp-2">{venue.notes}</p>}
              <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-[#F3F4F6]">
                <button onClick={() => openEdit(venue)} className="rounded-md p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1C1C1E] transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setConfirmDelete(venue._id)} className="rounded-md p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <VenueFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget ?? undefined}
        mode={editTarget ? "edit" : "create"}
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-[#1C1C1E]">Delete Venue</h3>
            <p className="mt-2 text-sm text-[#6B7280]">Are you sure you want to delete this venue? This action cannot be undone.</p>
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
