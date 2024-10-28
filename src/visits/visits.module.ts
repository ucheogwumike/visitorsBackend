import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { Staff, StaffSchema } from 'src/staffs/schemas/staff.schema';
import { Visitor, VisitorsSchema } from 'src/visitors/schema/visitor.schema';
import { Visit, VisitsSchema } from './schema/visits.schema';
import {
  Department,
  DepartmentsSchema,
} from 'src/departments/schema/department.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffsService } from 'src/staffs/staffs.service';
import { VisitorsService } from 'src/visitors/visitors.service';
import { DepartmentsService } from 'src/departments/departments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Visitor.name, schema: VisitorsSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Visit.name, schema: VisitsSchema },
      { name: Department.name, schema: DepartmentsSchema },
    ]),
  ],
  providers: [
    VisitsService,
    StaffsService,
    VisitorsService,
    DepartmentsService,
  ],
  controllers: [VisitsController],
})
export class VisitsModule {}
