import { EventModel, EventStatus } from "../models/event.model";
import type { Types } from "mongoose";

export class EventService {
  static async getAll(userId: string) {
    return EventModel.find({ createdBy: userId }).sort({ eventDate: 1 }).lean();
  }

  static async getById(id: string, userId: string) {
    return EventModel.findOne({ _id: id, createdBy: userId }).lean();
  }

  static async create(userId: string, data: {
    title: string;
    description?: string;
    status?: EventStatus;
    eventDate: Date;
    endDate?: Date;
    location?: string;
    guestCount?: number;
    budget?: number;
    notes?: string;
  }) {
    const event = await EventModel.create({ ...data, createdBy: userId });
    return event.toObject();
  }

  static async update(id: string, userId: string, data: Partial<{
    title: string;
    description: string;
    status: EventStatus;
    eventDate: Date;
    endDate: Date;
    location: string;
    guestCount: number;
    budget: number;
    notes: string;
  }>) {
    return EventModel.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { $set: data },
      { new: true, lean: true }
    );
  }

  static async remove(id: string, userId: string) {
    return EventModel.findOneAndDelete({ _id: id, createdBy: userId });
  }

  static async getStats(userId: string) {
    const events = await EventModel.find({ createdBy: userId }).lean();
    return {
      total: events.length,
      planning: events.filter((e) => e.status === EventStatus.Planning).length,
      confirmed: events.filter((e) => e.status === EventStatus.Confirmed).length,
      inProgress: events.filter((e) => e.status === EventStatus.InProgress).length,
      completed: events.filter((e) => e.status === EventStatus.Completed).length,
      cancelled: events.filter((e) => e.status === EventStatus.Cancelled).length,
      upcoming: events.filter((e) => new Date(e.eventDate) >= new Date()).length,
    };
  }
}
