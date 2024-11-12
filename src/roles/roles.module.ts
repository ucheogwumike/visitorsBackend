import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RolesSchema } from './schemas/role.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/schemas/permission.schema';
import { PermissionsService } from 'src/permissions/permissions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RolesSchema }]),
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService, PermissionsService],
})
export class RolesModule {}
