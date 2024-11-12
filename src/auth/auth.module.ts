import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StaffsModule } from 'src/staffs/staffs.module';
import { StaffsService } from 'src/staffs/staffs.service';
import { VisitorsModule } from 'src/visitors/visitors.module';
import { VisitorsService } from 'src/visitors/visitors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from 'src/staffs/schemas/staff.schema';
import { Visitor, VisitorsSchema } from 'src/visitors/schema/visitor.schema';
import { Role, RolesSchema } from 'src/roles/schemas/role.schema';
import { RolesService } from 'src/roles/roles.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/schemas/permission.schema';

@Module({
  imports: [
    StaffsModule,
    VisitorsModule,
    MongooseModule.forFeature([
      { name: Staff.name, schema: StaffSchema },
      { name: Visitor.name, schema: VisitorsSchema },
      { name: Role.name, schema: RolesSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, StaffsService, VisitorsService, RolesService],
})
export class AuthModule {}
