import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { VisitorsService } from 'src/visitors/visitors.service';
import { StaffsService } from 'src/staffs/staffs.service';
import { VisitsService } from 'src/visits/visits.service';
import { Visitor } from 'src/visitors/schema/visitor.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Visitor.name) private VisitModel: Model<Visitor>,
    private mailerService: MailerService,
    private visitorService: VisitorsService,
    private staffService: StaffsService,
    private visitService: VisitsService,
  ) {}

  async sendVisitPass(code: any, picture: any): Promise<any> {
    console.log(code);
    console.log(picture);
    const visit = await this.visitService.findOne(picture);
    const picture1 = code.split(';base64,').pop();

    const visitor = await this.VisitModel.find({ _id: visit?.visitor[0] });

    fs.writeFile('image.png', picture1, { encoding: 'base64' }, function (err) {
      console.log('File created');
    });
    await this.mailerService.sendMail({
      to: visitor[0].email,
      from: process.env.MAIL_USER,
      subject: 'Your Visit Has Been Approved',
      template: './sendConfirmation',
    });
  }
}
