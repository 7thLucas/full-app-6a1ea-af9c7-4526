import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "~/lib/api.client";

export interface Guest {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  rsvpStatus: string;
  plusOnes?: number;
  dietaryRequirements?: string;
  tableNumber?: string;
  notes?: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestStats {
  total: number;
  totalWithPlusOnes: number;
  confirmed: number;
  declined: number;
  pending: number;
  waitlisted: number;
}

export function useGuests(eventId: string) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Guest[]>("/api/eventflow/guests", { method: "GET", params: { eventId } });
      if (res.success && res.data) setGuests(res.data);
      else setError(res.message ?? "Failed to load guests");
    } catch {
      setError("Failed to load guests");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  const createGuest = useCallback(async (data: Partial<Guest> & { eventId: string }) => {
    const res = await apiRequest<Guest>("/api/eventflow/guests", { method: "POST", data });
    if (res.success && res.data) setGuests((prev) => [...prev, res.data!]);
    return res;
  }, []);

  const updateGuest = useCallback(async (id: string, data: Partial<Guest>) => {
    const res = await apiRequest<Guest>(`/api/eventflow/guests/${id}`, { method: "PUT", data });
    if (res.success && res.data) setGuests((prev) => prev.map((g) => (g._id === id ? res.data! : g)));
    return res;
  }, []);

  const deleteGuest = useCallback(async (id: string) => {
    const res = await apiRequest(`/api/eventflow/guests/${id}`, { method: "DELETE" });
    if (res.success) setGuests((prev) => prev.filter((g) => g._id !== id));
    return res;
  }, []);

  return { guests, loading, error, refetch: fetchGuests, createGuest, updateGuest, deleteGuest };
}
