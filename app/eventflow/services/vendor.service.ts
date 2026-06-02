import { VendorModel, VendorCategory, VendorStatus, PaymentStatus } from "../models/vendor.model";

export class VendorService {
  static async getAll(userId: string, eventId?: string) {
    const filter: Record<string, unknown> = { createdBy: userId };
    if (eventId) filter.eventId = eventId;
    return VendorModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  static async getById(id: string, userId: string) {
    return VendorModel.findOne({ _id: id, createdBy: userId }).lean();
  }

  static async create(userId: string, data: {
    name: string;
    category?: VendorCategory;
    status?: VendorStatus;
    paymentStatus?: PaymentStatus;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    contractAmount?: number;
    depositAmount?: number;
    notes?: string;
    eventId?: string;
  }) {
    const vendor = await VendorModel.create({ ...data, createdBy: userId });
    return vendor.toObject();
  }

  static async update(id: string, userId: string, data: Partial<{
    name: string;
    category: VendorCategory;
    status: VendorStatus;
    paymentStatus: PaymentStatus;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    contractAmount: number;
    depositAmount: number;
    notes: string;
    eventId: string;
  }>) {
    return VendorModel.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { $set: data },
      { new: true, lean: true }
    );
  }

  static async remove(id: string, userId: string) {
    return VendorModel.findOneAndDelete({ _id: id, createdBy: userId });
  }
}
