import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema()
export class Department {
  @Prop()
  name: string;

  @Prop()
  color: string;
}

export const DepartmentsSchema = SchemaFactory.createForClass(Department);
