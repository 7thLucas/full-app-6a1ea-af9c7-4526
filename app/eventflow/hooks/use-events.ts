import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "~/lib/api.client";

export interface Event {
  _id: string;
  id: string;
  title: string;
  description?: string;
  status: string;
  eventDate: string;
  endDate?: string;
  location?: string;
  guestCount?: number;
  budget?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventStats {
  total: number;
  planning: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Event[]>("/api/eventflow/events");
      if (res.success && res.data) setEvents(res.data);
      else setError(res.message ?? "Failed to load events");
    } catch {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const createEvent = useCallback(async (data: Partial<Event>) => {
    const res = await apiRequest<Event>("/api/eventflow/events", { method: "POST", data });
    if (res.success && res.data) {
      setEvents((prev) => [res.data!, ...prev]);
    }
    return res;
  }, []);

  const updateEvent = useCallback(async (id: string, data: Partial<Event>) => {
    const res = await apiRequest<Event>(`/api/eventflow/events/${id}`, { method: "PUT", data });
    if (res.success && res.data) {
      setEvents((prev) => prev.map((e) => (e._id === id ? res.data! : e)));
    }
    return res;
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    const res = await apiRequest(`/api/eventflow/events/${id}`, { method: "DELETE" });
    if (res.success) {
      setEvents((prev) => prev.filter((e) => e._id !== id));
    }
    return res;
  }, []);

  return { events, loading, error, refetch: fetchEvents, createEvent, updateEvent, deleteEvent };
}

export function useEventStats() {
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<EventStats>("/api/eventflow/events/stats").then((res) => {
      if (res.success && res.data) setStats(res.data);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
}
