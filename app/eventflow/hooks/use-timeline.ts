import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "~/lib/api.client";

export interface TimelineItem {
  _id: string;
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  type: string;
  status: string;
  assignedTo?: string;
  location?: string;
  notes?: string;
  sortOrder?: number;
  eventId: string;
  createdAt: string;
  updatedAt: string;
}

export function useTimeline(eventId: string) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<TimelineItem[]>("/api/eventflow/timeline", { method: "GET", params: { eventId } });
      if (res.success && res.data) setItems(res.data);
      else setError(res.message ?? "Failed to load timeline");
    } catch {
      setError("Failed to load timeline");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchTimeline(); }, [fetchTimeline]);

  const createItem = useCallback(async (data: Partial<TimelineItem> & { eventId: string }) => {
    const res = await apiRequest<TimelineItem>("/api/eventflow/timeline", { method: "POST", data });
    if (res.success && res.data) setItems((prev) => [...prev, res.data!]);
    return res;
  }, []);

  const updateItem = useCallback(async (id: string, data: Partial<TimelineItem>) => {
    const res = await apiRequest<TimelineItem>(`/api/eventflow/timeline/${id}`, { method: "PUT", data });
    if (res.success && res.data) setItems((prev) => prev.map((i) => (i._id === id ? res.data! : i)));
    return res;
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const res = await apiRequest(`/api/eventflow/timeline/${id}`, { method: "DELETE" });
    if (res.success) setItems((prev) => prev.filter((i) => i._id !== id));
    return res;
  }, []);

  return { items, loading, error, refetch: fetchTimeline, createItem, updateItem, deleteItem };
}
