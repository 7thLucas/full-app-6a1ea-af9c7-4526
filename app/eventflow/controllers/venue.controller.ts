import type { Request, Response } from "express";
import { VenueService } from "../services/venue.service";

export async function getVenues(req: Request, res: Response) {
  try {
    const eventId = req.query.eventId as string | undefined;
    const venues = await VenueService.getAll(req.user!.id, eventId);
    return res.json({ success: true, data: venues });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch venues" });
  }
}

export async function getVenue(req: Request, res: Response) {
  try {
    const venue = await VenueService.getById(String(req.params.id), req.user!.id);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });
    return res.json({ success: true, data: venue });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch venue" });
  }
}

export async function createVenue(req: Request, res: Response) {
  try {
    const { name, address, capacity, status, contactName, contactEmail, contactPhone, pricePerDay, notes, eventId } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    const venue = await VenueService.create(req.user!.id, {
      name, address, capacity, status, contactName, contactEmail, contactPhone, pricePerDay, notes, eventId,
    });
    return res.status(201).json({ success: true, data: venue });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to create venue" });
  }
}

export async function updateVenue(req: Request, res: Response) {
  try {
    const venue = await VenueService.update(String(req.params.id), req.user!.id, req.body);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });
    return res.json({ success: true, data: venue });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to update venue" });
  }
}

export async function deleteVenue(req: Request, res: Response) {
  try {
    const venue = await VenueService.remove(String(req.params.id), req.user!.id);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });
    return res.json({ success: true, message: "Venue deleted" });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to delete venue" });
  }
}
