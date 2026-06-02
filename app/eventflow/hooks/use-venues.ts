import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "~/lib/api.client";

export interface Venue {
  _id: string;
  id: string;
  name: string;
  address?: string;
  capacity?: number;
  status: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  pricePerDay?: number;
  notes?: string;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
}

export function useVenues(eventId?: string) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = eventId ? { eventId } : undefined;
      const res = await apiRequest<Venue[]>("/api/eventflow/venues", { method: "GET", params });
      if (res.success && res.data) setVenues(res.data);
      else setError(res.message ?? "Failed to load venues");
    } catch {
      setError("Failed to load venues");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  const createVenue = useCallback(async (data: Partial<Venue>) => {
    const res = await apiRequest<Venue>("/api/eventflow/venues", { method: "POST", data });
    if (res.success && res.data) setVenues((prev) => [res.data!, ...prev]);
    return res;
  }, []);

  const updateVenue = useCallback(async (id: string, data: Partial<Venue>) => {
    const res = await apiRequest<Venue>(`/api/eventflow/venues/${id}`, { method: "PUT", data });
    if (res.success && res.data) setVenues((prev) => prev.map((v) => (v._id === id ? res.data! : v)));
    return res;
  }, []);

  const deleteVenue = useCallback(async (id: string) => {
    const res = await apiRequest(`/api/eventflow/venues/${id}`, { method: "DELETE" });
    if (res.success) setVenues((prev) => prev.filter((v) => v._id !== id));
    return res;
  }, []);

  return { venues, loading, error, refetch: fetchVenues, createVenue, updateVenue, deleteVenue };
}
