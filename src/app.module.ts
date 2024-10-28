import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffsModule } from './staffs/staffs.module';
import { VisitorsModule } from './visitors/visitors.module';
import { VisitsModule } from './visits/visits.module';
import { RolesModule } from './roles/roles.module';
import { DepartmentsModule } from './departments/departments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/visitor'),
    StaffsModule,
    VisitorsModule,
    VisitsModule,
    RolesModule,
    DepartmentsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
