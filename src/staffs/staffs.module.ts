import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from './schemas/staff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
  ],
  providers: [StaffsService],
  controllers: [StaffsController],
})
export class StaffsModule {}
