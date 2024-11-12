import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Visit } from './schema/visits.schema';
import { VisitDTO } from './dto/visits.dto';
import { StaffsService } from 'src/staffs/staffs.service';
import { VisitorsService } from 'src/visitors/visitors.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { Visitor } from 'src/visitors/schema/visitor.schema';
// import { MailService } from 'src/mail/mail.service';
// import { MailModule } from 'src/mail/mail.module';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private VisitModel: Model<Visit>,
    @InjectModel(Visitor.name) private VisitorModel: Model<Visitor>,
    private staffService: StaffsService,
    private visitorService: VisitorsService,
    private departmentService: DepartmentsService,
    private mailerService: MailerService,
  ) {}

  SuccessResponse(
    message: string,
    data: any = {},
    code: HttpStatus = HttpStatus.OK,
  ) {
    return { data, message, error: false, code };
  }

  async uniqueCode(): Promise<any> {
    const code =
      new Date().getFullYear().toString() +
      Math.floor(0 + Math.random() * 99999).toString();

    const check = await this.findOne(code);

    if (check) {
      await this.uniqueCode();
    } else {
      return code;
    }
  }

  async findAll(query?: any): Promise<Visit[]> {
    return await this.VisitModel.find()
      .populate('visitor')
      .populate('staff')
      .populate('department')
      .skip((query?.page - 1) * 10)
      .limit(10)
      .exec();
  }

  async findOne(code: any): Promise<Visit | null> {
    const visit = await this.VisitModel.findOne({ code })
      .populate('visitor')
      .populate('staff')
      .populate('department');

    if (visit) {
      return visit;
    } else {
      throw new NotFoundException('visit not found');
    }
  }

  async findVisitor(code: any): Promise<any> {
    const visit = await this.VisitModel.findOne({ code });

    const visitor = await this.VisitorModel.findById(visit?.visitor[0]._id);

    if (visitor) {
      return this.SuccessResponse(
        'visitor created successfully',
        visitor,
        HttpStatus.OK,
      );
    } else {
      throw new NotFoundException('visitor not found');
    }
  }

  async findAllForAUser(detail: any): Promise<any> {
    console.log(detail.email, detail.type);
    let user;
    if (detail.type === 'staff') {
      user = await this.staffService.findOne(detail.email);
      console.log(user);
      const userData = await this.VisitModel.find({
        staff: user?._id,
      }).exec();
      // if (user) {
      //   const x = await this.VisitModel.aggregate([
      //     {
      //       $lookup: {
      //         from: 'staff',
      //         localField: 'staff',
      //         foreignField: '_id',
      //         as: 'resultingArray',
      //       },
      //     },
      //     { $match: { 'resultingArray._id': user['_id'] } },
      //   ]);

      //   console.log(x);
      // }
      return userData;
    } else if (detail.type === 'visitor') {
      user = await this.visitorService.findOne(detail.email);
      console.log(user);
      const userData = await this.VisitModel.find({
        visitor: user?._id,
      })
        .populate('department')
        .exec();

      return userData;
    }
  }

  async create(visit: VisitDTO): Promise<any> {
    // if (await this.findOne(department.name)) {
    //   throw new BadRequestException('departnment name already exists');
    // }
    let checkSpam = 0;
    const oldVisits = await this.findAllForAUser({
      email: visit.visitorEmail,
      type: 'visitor',
    });

    for (const old of oldVisits) {
      if (old.status === 'ongoing' || old.status === 'pre-booked') {
        checkSpam = checkSpam + 1;
      }
    }

    if (checkSpam > 3) {
      throw new BadRequestException('You have booked too many visits');
    }
    const meet = new Date();
    const newMeet = new Date(
      meet.getTime() - meet.getTimezoneOffset() * 60 * 1000,
    ); //`${new Date().getFullYear().toString()}-${(new Date().getMonth() + 1).toString()}-${(new Date().getDate()).toString()}`;
    if (!visit.dateOfVisit) {
      visit.dateOfVisit = newMeet.toISOString().substring(0, 10).split('T')[0];
    }
    if (visit.signIn) {
      const time = visit.signIn;
      const [h, m] = time.split(':');
      const ms = new Date().setHours(parseInt(h), parseInt(m));
      visit.signIn = new Date(ms).toTimeString().split(' ')[0];
      visit.status = 'ongoing';
    } else {
      visit.status = 'pre-booked';
    }
    visit.code = await this.uniqueCode();
    if (visit.staff) {
      visit.staff = await this.staffService.findOne(visit.staffEmail);
    }
    visit.visitor = await this.visitorService.findOne(visit.visitorEmail);
    console.log(visit.visitor);
    visit.department = await this.departmentService.findOne(
      visit.departmentName,
    );

    if (!visit.staff && visit.type !== 'visitor') {
      throw new NotFoundException('staff not found');
    }

    if (!visit.visitor) {
      throw new NotFoundException('visitor not found');
    }

    if (!visit.department) {
      throw new NotFoundException('department not found');
    }

    if (!visit.visitor['status']) {
      throw new BadRequestException('A blocked visitor can not book a visit');
    }

    const newVisit = await this.VisitModel.create(visit);
    console.log(newVisit);
    // create code ;

    await this.mailerService
      .sendMail({
        to: visit.visitorEmail,
        from: process.env.MAIL_USER,
        subject: 'Visit Pre Booked',
        html: `<p>You have successfully prebooked a visit for ${newVisit?.dateOfVisit}.</p>
        <p>On the day of your visit Please show the code below at the reception to proceed </p>
        <p>meeting code : ${newVisit?.code} </p>
        

        <p>Thank You!</p>
        `,
      })
      .then(() => {
        // return 'email successfully sent';
        return this.SuccessResponse(
          'visit created successfully',
          { created: true, visit, mail: 'sent' },
          HttpStatus.CREATED,
        );
      })
      .catch((error) => {
        return error;
      }); //sendPreRegMail(visit.visitorEmail, newVisit);
  }

  async reschedule(visitCode: { code: string; date: string }): Promise<any> {
    const visit = await this.findOne(visitCode.code);

    if (!visit) {
      throw new NotFoundException();
    }
    console.log(visitCode);
    const updatedVisit = await this.VisitModel.updateOne(
      { code: visit.code },
      { dateOfVisit: visitCode.date },
    );

    const newVisit = await this.findOne(visitCode.code);

    await this.mailerService
      .sendMail({
        to: visit?.visitor[0]?.email,
        from: process.env.MAIL_USER,
        subject: 'Visit Rescheduled',
        html: `<p>You Visit has been rescheduled from ${visit?.dateOfVisit}.</p>
        <p>To this date ${newVisit?.dateOfVisit}</p>
        <p>meeting code : ${newVisit?.code} </p>
        

        <p>Thank You!</p>
        `,
      })
      .then(() => {
        // return 'email successfully sent';
        return this.SuccessResponse(
          'visit updated successfully',
          { created: true, updatedVisit, mail: 'sent' },
          HttpStatus.CREATED,
        );
      })
      .catch((error) => {
        return error;
      });
  }

  async update(visit: any): Promise<any> {
    const check = await this.findOne(visit.code);
    console.log(check);
    // console.log(visit);
    if (!check) {
      throw new NotFoundException('visit not found');
    }
    delete visit._id;
    const updatedVisit = await this.VisitModel.updateOne(
      { code: visit.code },
      {
        signIn: visit?.signIn ? visit.signIn : check.signIn,
        signOut: visit?.signOut ? visit.signOut : check.signOut,
        status: visit?.status ? visit.status : check.status,
      },
    );
    // console.log(updatedVisit);
    return this.SuccessResponse(
      'visit updated successfully',
      { created: true, updatedVisit },
      HttpStatus.OK,
    );
  }
}
