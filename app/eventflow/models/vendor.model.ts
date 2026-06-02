import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

export enum VendorStatus {
  Prospecting = "prospecting",
  Contacted = "contacted",
  Negotiating = "negotiating",
  Booked = "booked",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
}

export enum VendorCategory {
  Catering = "catering",
  Photography = "photography",
  Videography = "videography",
  Music = "music",
  Florals = "florals",
  Decor = "decor",
  Transportation = "transportation",
  Security = "security",
  Lighting = "lighting",
  Entertainment = "entertainment",
  Other = "other",
}

export enum PaymentStatus {
  Unpaid = "unpaid",
  DepositPaid = "deposit_paid",
  PartiallyPaid = "partially_paid",
  Paid = "paid",
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    collection: "tbl_vendors",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Vendor extends TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, enum: VendorCategory, default: VendorCategory.Other })
  category!: VendorCategory;

  @prop({ required: true, enum: VendorStatus, default: VendorStatus.Prospecting })
  status!: VendorStatus;

  @prop({ enum: PaymentStatus, default: PaymentStatus.Unpaid })
  paymentStatus!: PaymentStatus;

  @prop()
  contactName?: string;

  @prop()
  contactEmail?: string;

  @prop()
  contactPhone?: string;

  @prop()
  contractAmount?: number;

  @prop()
  depositAmount?: number;

  @prop()
  notes?: string;

  @prop({ type: () => Types.ObjectId })
  createdBy!: Types.ObjectId;

  @prop({ type: () => Types.ObjectId })
  eventId?: Types.ObjectId;
}

export const VendorModel = getModelForClass(Vendor);
