import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  _id: string;
  @Prop()
  name: string;
  @Prop({ ref: Permission.name })
  permissions: Permission[];
}

export const RolesSchema = SchemaFactory.createForClass(Role);
