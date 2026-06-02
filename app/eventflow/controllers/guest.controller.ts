import type { Request, Response } from "express";
import { GuestService } from "../services/guest.service";

export async function getGuests(req: Request, res: Response) {
  try {
    const { eventId } = req.query;
    if (!eventId) return res.status(400).json({ success: false, message: "eventId is required" });
    const guests = await GuestService.getAll(req.user!.id, String(eventId));
    return res.json({ success: true, data: guests });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch guests" });
  }
}

export async function getGuest(req: Request, res: Response) {
  try {
    const guest = await GuestService.getById(String(req.params.id), req.user!.id);
    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });
    return res.json({ success: true, data: guest });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch guest" });
  }
}

export async function createGuest(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, phone, rsvpStatus, plusOnes, dietaryRequirements, tableNumber, notes, eventId } = req.body;
    if (!firstName || !lastName || !eventId) {
      return res.status(400).json({ success: false, message: "First name, last name, and eventId are required" });
    }
    const guest = await GuestService.create(req.user!.id, {
      firstName, lastName, email, phone, rsvpStatus, plusOnes, dietaryRequirements, tableNumber, notes, eventId,
    });
    return res.status(201).json({ success: true, data: guest });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to create guest" });
  }
}

export async function updateGuest(req: Request, res: Response) {
  try {
    const guest = await GuestService.update(String(req.params.id), req.user!.id, req.body);
    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });
    return res.json({ success: true, data: guest });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to update guest" });
  }
}

export async function deleteGuest(req: Request, res: Response) {
  try {
    const guest = await GuestService.remove(String(req.params.id), req.user!.id);
    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });
    return res.json({ success: true, message: "Guest deleted" });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to delete guest" });
  }
}

export async function getGuestStats(req: Request, res: Response) {
  try {
    const { eventId } = req.query;
    if (!eventId) return res.status(400).json({ success: false, message: "eventId is required" });
    const stats = await GuestService.getStats(req.user!.id, String(eventId));
    return res.json({ success: true, data: stats });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch guest stats" });
  }
}
