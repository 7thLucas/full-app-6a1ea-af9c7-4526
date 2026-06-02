import type { Request, Response } from "express";
import { VendorService } from "../services/vendor.service";

export async function getVendors(req: Request, res: Response) {
  try {
    const eventId = req.query.eventId as string | undefined;
    const vendors = await VendorService.getAll(req.user!.id, eventId);
    return res.json({ success: true, data: vendors });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch vendors" });
  }
}

export async function getVendor(req: Request, res: Response) {
  try {
    const vendor = await VendorService.getById(String(req.params.id), req.user!.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    return res.json({ success: true, data: vendor });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch vendor" });
  }
}

export async function createVendor(req: Request, res: Response) {
  try {
    const { name, category, status, paymentStatus, contactName, contactEmail, contactPhone, contractAmount, depositAmount, notes, eventId } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    const vendor = await VendorService.create(req.user!.id, {
      name, category, status, paymentStatus, contactName, contactEmail, contactPhone, contractAmount, depositAmount, notes, eventId,
    });
    return res.status(201).json({ success: true, data: vendor });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to create vendor" });
  }
}

export async function updateVendor(req: Request, res: Response) {
  try {
    const vendor = await VendorService.update(String(req.params.id), req.user!.id, req.body);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    return res.json({ success: true, data: vendor });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to update vendor" });
  }
}

export async function deleteVendor(req: Request, res: Response) {
  try {
    const vendor = await VendorService.remove(String(req.params.id), req.user!.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    return res.json({ success: true, message: "Vendor deleted" });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to delete vendor" });
  }
}
