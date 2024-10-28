import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, DepartmentsSchema } from './schema/department.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentsSchema },
    ]),
  ],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
