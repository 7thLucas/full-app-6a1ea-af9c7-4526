import { TimelineItemModel, TimelineItemStatus, TimelineItemType } from "../models/timeline-item.model";

export class TimelineService {
  static async getAll(userId: string, eventId: string) {
    return TimelineItemModel.find({ createdBy: userId, eventId }).sort({ sortOrder: 1, startTime: 1 }).lean();
  }

  static async getById(id: string, userId: string) {
    return TimelineItemModel.findOne({ _id: id, createdBy: userId }).lean();
  }

  static async create(userId: string, data: {
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    type?: TimelineItemType;
    status?: TimelineItemStatus;
    assignedTo?: string;
    location?: string;
    notes?: string;
    sortOrder?: number;
    eventId: string;
  }) {
    const item = await TimelineItemModel.create({ ...data, createdBy: userId });
    return item.toObject();
  }

  static async update(id: string, userId: string, data: Partial<{
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    type: TimelineItemType;
    status: TimelineItemStatus;
    assignedTo: string;
    location: string;
    notes: string;
    sortOrder: number;
  }>) {
    return TimelineItemModel.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { $set: data },
      { new: true, lean: true }
    );
  }

  static async remove(id: string, userId: string) {
    return TimelineItemModel.findOneAndDelete({ _id: id, createdBy: userId });
  }
}
