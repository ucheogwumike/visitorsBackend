import { Module } from '@nestjs/common';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { Visitor, VisitorsSchema } from './schema/visitor.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffsModule } from 'src/staffs/staffs.module';
import { Staff, StaffSchema } from 'src/staffs/schemas/staff.schema';
import { StaffsService } from 'src/staffs/staffs.service';

@Module({
  imports: [
    StaffsModule,
    MongooseModule.forFeature([
      { name: Visitor.name, schema: VisitorsSchema },
      { name: Staff.name, schema: StaffSchema },
    ]),
  ],
  controllers: [VisitorsController],
  providers: [VisitorsService, StaffsService],
})
export class VisitorsModule {}
