import { useState } from "react";
import { Truck, Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useVendors } from "~/eventflow/hooks/use-vendors";
import { VendorFormDialog } from "~/eventflow/components/vendor-form-dialog";
import { StatusBadge } from "~/eventflow/components/status-badge";
import { EmptyState } from "~/eventflow/components/empty-state";
import { PageHeader } from "~/eventflow/components/page-header";
import type { Vendor } from "~/eventflow/hooks/use-vendors";

const categoryLabels: Record<string, string> = {
  catering: "Catering",
  photography: "Photography",
  videography: "Videography",
  music: "Music",
  florals: "Florals",
  decor: "Decor",
  transportation: "Transportation",
  security: "Security",
  lighting: "Lighting",
  entertainment: "Entertainment",
  other: "Other",
};

export default function VendorsPage() {
  const { vendors, loading, createVendor, updateVendor, deleteVendor } = useVendors();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Vendor | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.contactName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (categoryLabels[v.category] ?? v.category).toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (vendor: Vendor) => { setEditTarget(vendor); setDialogOpen(true); };

  const handleSubmit = async (data: Partial<Vendor>) => {
    if (editTarget) await updateVendor(editTarget._id, data);
    else await createVendor(data);
  };

  const handleDelete = async (id: string) => {
    await deleteVendor(id);
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Vendors"
        description="Track vendor agreements, payments, and communications."
        action={
          <Button onClick={openCreate} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90 gap-1.5">
            <Plus className="h-4 w-4" /> Add Vendor
          </Button>
        }
      />

      <div className="mb-5 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        <Input className="pl-9" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl border border-[#E5E7EB] bg-white animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Truck className="h-6 w-6" />}
          title={search ? "No vendors found" : "No vendors yet"}
          description={search ? "Try a different search term." : "Add your first vendor to start tracking agreements and payments."}
          action={
            !search ? (
              <Button onClick={openCreate} style={{ backgroundColor: "#1B4332", color: "white" }} className="hover:opacity-90 gap-1.5">
                <Plus className="h-4 w-4" /> Add Vendor
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Vendor</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Payment</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">Contract</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#1C1C1E]">{vendor.name}</p>
                      {vendor.contactName && <p className="mt-0.5 text-xs text-[#6B7280]">{vendor.contactName}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[#F3F4F6] px-2 py-1 text-xs font-medium text-[#1C1C1E]">
                        {categoryLabels[vendor.category] ?? vendor.category}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={vendor.status} /></td>
                    <td className="px-5 py-4"><StatusBadge status={vendor.paymentStatus} /></td>
                    <td className="px-5 py-4 text-sm text-[#6B7280]">
                      {vendor.contractAmount ? `$${vendor.contractAmount.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(vendor)} className="rounded-md p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1C1C1E] transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setConfirmDelete(vendor._id)} className="rounded-md p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-colors">
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

      <VendorFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initial={editTarget ?? undefined}
        mode={editTarget ? "edit" : "create"}
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-[#1C1C1E]">Delete Vendor</h3>
            <p className="mt-2 text-sm text-[#6B7280]">Are you sure you want to delete this vendor? This action cannot be undone.</p>
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
