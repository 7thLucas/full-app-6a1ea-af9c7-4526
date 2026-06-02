import { GuestModel, RsvpStatus } from "../models/guest.model";

export class GuestService {
  static async getAll(userId: string, eventId: string) {
    return GuestModel.find({ createdBy: userId, eventId }).sort({ lastName: 1 }).lean();
  }

  static async getById(id: string, userId: string) {
    return GuestModel.findOne({ _id: id, createdBy: userId }).lean();
  }

  static async create(userId: string, data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    rsvpStatus?: RsvpStatus;
    plusOnes?: number;
    dietaryRequirements?: string;
    tableNumber?: string;
    notes?: string;
    eventId: string;
  }) {
    const guest = await GuestModel.create({ ...data, createdBy: userId });
    return guest.toObject();
  }

  static async update(id: string, userId: string, data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    rsvpStatus: RsvpStatus;
    plusOnes: number;
    dietaryRequirements: string;
    tableNumber: string;
    notes: string;
  }>) {
    return GuestModel.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { $set: data },
      { new: true, lean: true }
    );
  }

  static async remove(id: string, userId: string) {
    return GuestModel.findOneAndDelete({ _id: id, createdBy: userId });
  }

  static async getStats(userId: string, eventId: string) {
    const guests = await GuestModel.find({ createdBy: userId, eventId }).lean();
    const totalWithPlusOnes = guests.reduce((sum, g) => sum + 1 + (g.plusOnes ?? 0), 0);
    return {
      total: guests.length,
      totalWithPlusOnes,
      confirmed: guests.filter((g) => g.rsvpStatus === RsvpStatus.Confirmed).length,
      declined: guests.filter((g) => g.rsvpStatus === RsvpStatus.Declined).length,
      pending: guests.filter((g) => g.rsvpStatus === RsvpStatus.Pending).length,
      waitlisted: guests.filter((g) => g.rsvpStatus === RsvpStatus.Waitlisted).length,
    };
  }
}
