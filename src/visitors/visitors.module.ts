import { Module } from '@nestjs/common';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { Visitor, VisitorsSchema } from './schema/visitor.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffsModule } from 'src/staffs/staffs.module';
import { Staff, StaffSchema } from 'src/staffs/schemas/staff.schema';
import { StaffsService } from 'src/staffs/staffs.service';
import { Role, RolesSchema } from 'src/roles/schemas/role.schema';
import { RolesService } from 'src/roles/roles.service';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/schemas/permission.schema';

@Module({
  imports: [
    StaffsModule,
    MongooseModule.forFeature([
      { name: Visitor.name, schema: VisitorsSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Role.name, schema: RolesSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [VisitorsController],
  providers: [VisitorsService, StaffsService, RolesService],
})
export class VisitorsModule {}
