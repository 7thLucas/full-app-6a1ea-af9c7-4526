import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

export enum TimelineItemStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
  Skipped = "skipped",
}

export enum TimelineItemType {
  Setup = "setup",
  Ceremony = "ceremony",
  Reception = "reception",
  Meal = "meal",
  Entertainment = "entertainment",
  Speech = "speech",
  Break = "break",
  Departure = "departure",
  Other = "other",
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    collection: "tbl_timeline_items",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class TimelineItem extends TimeStamps {
  @prop({ required: true })
  title!: string;

  @prop()
  description?: string;

  @prop({ required: true })
  startTime!: string;

  @prop()
  endTime?: string;

  @prop({ required: true, enum: TimelineItemType, default: TimelineItemType.Other })
  type!: TimelineItemType;

  @prop({ required: true, enum: TimelineItemStatus, default: TimelineItemStatus.Pending })
  status!: TimelineItemStatus;

  @prop()
  assignedTo?: string;

  @prop()
  location?: string;

  @prop()
  notes?: string;

  @prop({ default: 0 })
  sortOrder?: number;

  @prop({ type: () => Types.ObjectId })
  createdBy!: Types.ObjectId;

  @prop({ required: true, type: () => Types.ObjectId })
  eventId!: Types.ObjectId;
}

export const TimelineItemModel = getModelForClass(TimelineItem);
