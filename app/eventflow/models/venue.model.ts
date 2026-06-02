import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

export enum VenueStatus {
  Available = "available",
  Reserved = "reserved",
  Confirmed = "confirmed",
  Unavailable = "unavailable",
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    collection: "tbl_venues",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Venue extends TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop()
  address?: string;

  @prop()
  capacity?: number;

  @prop({ required: true, enum: VenueStatus, default: VenueStatus.Available })
  status!: VenueStatus;

  @prop()
  contactName?: string;

  @prop()
  contactEmail?: string;

  @prop()
  contactPhone?: string;

  @prop()
  pricePerDay?: number;

  @prop()
  notes?: string;

  @prop({ type: () => Types.ObjectId })
  createdBy!: Types.ObjectId;

  @prop({ type: () => Types.ObjectId })
  eventId?: Types.ObjectId;
}

export const VenueModel = getModelForClass(Venue);
