import type { Request, Response } from "express";
import { EventService } from "../services/event.service";

export async function getEvents(req: Request, res: Response) {
  try {
    const events = await EventService.getAll(req.user!.id);
    return res.json({ success: true, data: events });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
}

export async function getEvent(req: Request, res: Response) {
  try {
    const event = await EventService.getById(String(req.params.id), req.user!.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    return res.json({ success: true, data: event });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch event" });
  }
}

export async function createEvent(req: Request, res: Response) {
  try {
    const { title, description, status, eventDate, endDate, location, guestCount, budget, notes } = req.body;
    if (!title || !eventDate) {
      return res.status(400).json({ success: false, message: "Title and event date are required" });
    }
    const event = await EventService.create(req.user!.id, {
      title,
      description,
      status,
      eventDate: new Date(eventDate),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      guestCount,
      budget,
      notes,
    });
    return res.status(201).json({ success: true, data: event });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to create event" });
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    const data = { ...req.body };
    if (data.eventDate) data.eventDate = new Date(data.eventDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    const event = await EventService.update(String(req.params.id), req.user!.id, data);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    return res.json({ success: true, data: event });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to update event" });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const event = await EventService.remove(String(req.params.id), req.user!.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    return res.json({ success: true, message: "Event deleted" });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to delete event" });
  }
}

export async function getEventStats(req: Request, res: Response) {
  try {
    const stats = await EventService.getStats(req.user!.id);
    return res.json({ success: true, data: stats });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
}
