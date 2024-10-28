import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type StaffDocument = HydratedDocument<Staff>;

@Schema()
export class Staff {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  MiddleName: string;

  @Prop()
  regNumber: string;

  @Prop()
  department: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  profile_picture: string;

  @Prop()
  status: boolean;

  @Prop()
  limit: number;

  @Prop({ ref: Role.name })
  role: Role;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
