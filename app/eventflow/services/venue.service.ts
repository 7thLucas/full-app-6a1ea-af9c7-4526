import { VenueModel, VenueStatus } from "../models/venue.model";

export class VenueService {
  static async getAll(userId: string, eventId?: string) {
    const filter: Record<string, unknown> = { createdBy: userId };
    if (eventId) filter.eventId = eventId;
    return VenueModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  static async getById(id: string, userId: string) {
    return VenueModel.findOne({ _id: id, createdBy: userId }).lean();
  }

  static async create(userId: string, data: {
    name: string;
    address?: string;
    capacity?: number;
    status?: VenueStatus;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    pricePerDay?: number;
    notes?: string;
    eventId?: string;
  }) {
    const venue = await VenueModel.create({ ...data, createdBy: userId });
    return venue.toObject();
  }

  static async update(id: string, userId: string, data: Partial<{
    name: string;
    address: string;
    capacity: number;
    status: VenueStatus;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    pricePerDay: number;
    notes: string;
    eventId: string;
  }>) {
    return VenueModel.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { $set: data },
      { new: true, lean: true }
    );
  }

  static async remove(id: string, userId: string) {
    return VenueModel.findOneAndDelete({ _id: id, createdBy: userId });
  }
}
