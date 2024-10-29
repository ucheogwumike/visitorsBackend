import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';
import { Department } from 'src/departments/schema/department.schema';
import { Staff } from 'src/staffs/schemas/staff.schema';
import { Visitor } from 'src/visitors/schema/visitor.schema';

export type VisitDocument = HydratedDocument<Visit>;

@Schema()
export class Visit {
  @Prop({ default: false })
  rescheduled: boolean;

  @Prop({ type: Date, default: Date.now })
  dateUpdated: string;

  @Prop({ type: Date })
  dateOfVisit: string;

  @Prop({ type: Date, default: Date.now })
  dateCreated: string;

  @Prop({ default: null })
  signIn: string;

  @Prop({ default: null })
  signOut: string;

  @Prop({ default: 'reception' })
  type: string;

  @Prop({ ref: Visitor.name })
  visitor: Visitor[];

  @Prop({ ref: Staff.name })
  staff: Staff[];

  @Prop({ ref: Department.name })
  department: Department[];

  @Prop()
  room: string;

  @Prop()
  floor: string;

  @Prop({ default: 'ongoing' })
  status: string;

  @Prop({ default: null })
  picture: string;

  @Prop()
  code: string;
}

export const VisitsSchema = SchemaFactory.createForClass(Visit);
