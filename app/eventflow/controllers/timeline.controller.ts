import type { Request, Response } from "express";
import { TimelineService } from "../services/timeline.service";

export async function getTimeline(req: Request, res: Response) {
  try {
    const { eventId } = req.query;
    if (!eventId) return res.status(400).json({ success: false, message: "eventId is required" });
    const items = await TimelineService.getAll(req.user!.id, String(eventId));
    return res.json({ success: true, data: items });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch timeline" });
  }
}

export async function getTimelineItem(req: Request, res: Response) {
  try {
    const item = await TimelineService.getById(String(req.params.id), req.user!.id);
    if (!item) return res.status(404).json({ success: false, message: "Timeline item not found" });
    return res.json({ success: true, data: item });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch timeline item" });
  }
}

export async function createTimelineItem(req: Request, res: Response) {
  try {
    const { title, description, startTime, endTime, type, status, assignedTo, location, notes, sortOrder, eventId } = req.body;
    if (!title || !startTime || !eventId) {
      return res.status(400).json({ success: false, message: "Title, startTime, and eventId are required" });
    }
    const item = await TimelineService.create(req.user!.id, {
      title, description, startTime, endTime, type, status, assignedTo, location, notes, sortOrder, eventId,
    });
    return res.status(201).json({ success: true, data: item });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to create timeline item" });
  }
}

export async function updateTimelineItem(req: Request, res: Response) {
  try {
    const item = await TimelineService.update(String(req.params.id), req.user!.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: "Timeline item not found" });
    return res.json({ success: true, data: item });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to update timeline item" });
  }
}

export async function deleteTimelineItem(req: Request, res: Response) {
  try {
    const item = await TimelineService.remove(String(req.params.id), req.user!.id);
    if (!item) return res.status(404).json({ success: false, message: "Timeline item not found" });
    return res.json({ success: true, message: "Timeline item deleted" });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to delete timeline item" });
  }
}
