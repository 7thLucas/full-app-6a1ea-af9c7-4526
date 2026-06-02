import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

export enum EventStatus {
  Planning = "planning",
  Confirmed = "confirmed",
  InProgress = "in_progress",
  Completed = "completed",
  Cancelled = "cancelled",
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    collection: "tbl_events",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Event extends TimeStamps {
  @prop({ required: true })
  title!: string;

  @prop()
  description?: string;

  @prop({ required: true, enum: EventStatus, default: EventStatus.Planning })
  status!: EventStatus;

  @prop({ required: true })
  eventDate!: Date;

  @prop()
  endDate?: Date;

  @prop()
  location?: string;

  @prop({ type: () => Types.ObjectId })
  createdBy!: Types.ObjectId;

  @prop({ default: 0 })
  guestCount?: number;

  @prop()
  budget?: number;

  @prop()
  notes?: string;
}

export const EventModel = getModelForClass(Event);
