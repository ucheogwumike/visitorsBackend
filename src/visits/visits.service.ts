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
@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private VisitModel: Model<Visit>,
    @InjectModel(Visitor.name) private VisitorModel: Model<Visitor>,
    private staffService: StaffsService,
    private visitorService: VisitorsService,
    private departmentService: DepartmentsService,
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

  async findAll(): Promise<Visit[]> {
    return await this.VisitModel.find().exec();
  }

  async findOne(code: any): Promise<Visit | null> {
    return await this.VisitModel.findOne({ code })
      .populate('visitor')
      .populate('staff')
      .populate('department');
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
    }
    visit.code = await this.uniqueCode();
    visit.staff = await this.staffService.findOne(visit.staffEmail);
    visit.visitor = await this.visitorService.findOne(visit.visitorEmail);
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

    await this.VisitModel.create(visit);
    // create code ;
    if (await this.findOne(visit.code)) {
      return this.SuccessResponse(
        'visit created successfully',
        { created: true, visit },
        HttpStatus.CREATED,
      );
    }
  }

  async reschedule(
    visitCode: { code: string; date: string },
    email: string,
  ): Promise<any> {
    console.log(email);
    console.log(typeof email);
    const staff = await this.staffService.findOne(email);
    const visit = await this.findOne(visitCode.code);

    if (!staff) {
      throw new UnauthorizedException();
    }
    if (!visit) {
      throw new NotFoundException();
    }

    const updatedVisit = await this.VisitModel.updateOne(
      { dateOfVisit: visitCode.date },
      { status: false },
    );
    return this.SuccessResponse(
      'visit updated successfully',
      { created: true, updatedVisit },
      HttpStatus.OK,
    );
  }
}
