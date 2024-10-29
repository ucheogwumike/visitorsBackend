import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { VisitorsService } from 'src/visitors/visitors.service';
import { StaffsService } from 'src/staffs/staffs.service';
import { VisitsService } from 'src/visits/visits.service';
import { Visitor } from 'src/visitors/schema/visitor.schema';
import { Visit } from 'src/visits/schema/visits.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'node:fs/promises';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Visitor.name) private VisitorModel: Model<Visitor>,
    @InjectModel(Visit.name) private VisitModel: Model<Visit>,
    private mailerService: MailerService,
    private visitorService: VisitorsService,
    private staffService: StaffsService,
    private visitService: VisitsService,
  ) {}

  async sendVisitPass(code: any, picture: any): Promise<any> {
    const visit = await this.visitService.findOne(picture);
    const picture1 = code.split(';base64,').pop();

    const visitor = await this.VisitorModel.find({ _id: visit?.visitor[0] });

    await fs.writeFile(
      `${process.cwd()}/public/images/${visit?.code}.png`,
      picture1,
      'base64',
    );

    await this.VisitModel.updateOne(
      { code: visit?.code },
      { picture: `${process.env.API_URL}/images/${visit?.code}.png` },
    );

    // url = `/public/images/${visit?.code}.png`;
    console.log('File created');
    await this.mailerService.sendMail({
      to: visitor[0].email,
      from: process.env.MAIL_USER,
      subject: 'Your Visit Has Been Approved',
      html: `<p>Welcome please show the image attached to this 
        mail at the reception in order to proceed with your meeting</p>
        <p>meeting code : ${visit?.code} </p>
        <img src='${process.env.API_URL}/images/${visit?.code}.png'>

        <p>Thank You!</p>
        `,
      attachments: [
        {
          path: `${process.cwd()}/public/images/${visit?.code}.png`,
          filename: `${visit?.code}.png`,
          content: 'contentType',
        },
      ],
    });

    return 'email successfully sent';
  }
}
