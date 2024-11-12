import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema()
export class Permission {
  _id: string;
  @Prop()
  name: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
