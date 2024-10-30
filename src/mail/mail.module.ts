import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffsService } from 'src/staffs/staffs.service';
import { VisitorsService } from 'src/visitors/visitors.service';
import { VisitsService } from 'src/visits/visits.service';
import { Staff, StaffSchema } from 'src/staffs/schemas/staff.schema';
import { Visitor, VisitorsSchema } from 'src/visitors/schema/visitor.schema';
import { Visit, VisitsSchema } from 'src/visits/schema/visits.schema';
import {
  Department,
  DepartmentsSchema,
} from 'src/departments/schema/department.schema';
import { DepartmentsService } from 'src/departments/departments.service';
import { Role, RolesSchema } from 'src/roles/schemas/role.schema';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      // template: {
      //   dir: join(__dirname, 'templates'),
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
    MongooseModule.forFeature([
      { name: Visitor.name, schema: VisitorsSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Visit.name, schema: VisitsSchema },
      { name: Department.name, schema: DepartmentsSchema },
      { name: Role.name, schema: RolesSchema },
    ]),
  ],
  providers: [
    MailService,
    StaffsService,
    VisitorsService,
    VisitsService,
    DepartmentsService,
    RolesService,
  ],
  controllers: [MailController],
})
export class MailModule {}
