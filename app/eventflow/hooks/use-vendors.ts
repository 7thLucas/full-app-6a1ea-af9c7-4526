import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "~/lib/api.client";

export interface Vendor {
  _id: string;
  id: string;
  name: string;
  category: string;
  status: string;
  paymentStatus: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contractAmount?: number;
  depositAmount?: number;
  notes?: string;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
}

export function useVendors(eventId?: string) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = eventId ? { eventId } : undefined;
      const res = await apiRequest<Vendor[]>("/api/eventflow/vendors", { method: "GET", params });
      if (res.success && res.data) setVendors(res.data);
      else setError(res.message ?? "Failed to load vendors");
    } catch {
      setError("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const createVendor = useCallback(async (data: Partial<Vendor>) => {
    const res = await apiRequest<Vendor>("/api/eventflow/vendors", { method: "POST", data });
    if (res.success && res.data) setVendors((prev) => [res.data!, ...prev]);
    return res;
  }, []);

  const updateVendor = useCallback(async (id: string, data: Partial<Vendor>) => {
    const res = await apiRequest<Vendor>(`/api/eventflow/vendors/${id}`, { method: "PUT", data });
    if (res.success && res.data) setVendors((prev) => prev.map((v) => (v._id === id ? res.data! : v)));
    return res;
  }, []);

  const deleteVendor = useCallback(async (id: string) => {
    const res = await apiRequest(`/api/eventflow/vendors/${id}`, { method: "DELETE" });
    if (res.success) setVendors((prev) => prev.filter((v) => v._id !== id));
    return res;
  }, []);

  return { vendors, loading, error, refetch: fetchVendors, createVendor, updateVendor, deleteVendor };
}
