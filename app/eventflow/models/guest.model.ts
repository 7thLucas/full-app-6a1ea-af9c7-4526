import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

export enum RsvpStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Declined = "declined",
  Waitlisted = "waitlisted",
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    collection: "tbl_guests",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Guest extends TimeStamps {
  @prop({ required: true })
  firstName!: string;

  @prop({ required: true })
  lastName!: string;

  @prop()
  email?: string;

  @prop()
  phone?: string;

  @prop({ required: true, enum: RsvpStatus, default: RsvpStatus.Pending })
  rsvpStatus!: RsvpStatus;

  @prop()
  plusOnes?: number;

  @prop()
  dietaryRequirements?: string;

  @prop()
  tableNumber?: string;

  @prop()
  notes?: string;

  @prop({ type: () => Types.ObjectId })
  createdBy!: Types.ObjectId;

  @prop({ required: true, type: () => Types.ObjectId })
  eventId!: Types.ObjectId;
}

export const GuestModel = getModelForClass(Guest);
