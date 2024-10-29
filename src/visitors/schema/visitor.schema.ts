import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type VisitorDocument = HydratedDocument<Visitor>;

@Schema()
export class Visitor {
  _id: string;
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  MiddleName: string;

  @Prop()
  regNumber: string;

  @Prop()
  address: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;
  @Prop()
  company: string;

  @Prop({ default: null })
  profile_picture: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ ref: Role.name })
  role: Role;
}

export const VisitorsSchema = SchemaFactory.createForClass(Visitor);
