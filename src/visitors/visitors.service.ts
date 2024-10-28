import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Visitor } from './schema/visitor.schema';
import { VisitorDTO } from './dto/visitor.dto';
import { StaffsService } from 'src/staffs/staffs.service';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectModel(Visitor.name) private VisitorModel: Model<Visitor>,
    private staffService: StaffsService,
  ) {}

  SuccessResponse(
    message: string,
    data: any = {},
    code: HttpStatus = HttpStatus.OK,
  ) {
    return { data, message, error: false, code };
  }

  async findAll(): Promise<Visitor[]> {
    return await this.VisitorModel.find().exec();
  }

  async findOne(email: string): Promise<Visitor | null> {
    return await this.VisitorModel.findOne({ email });
  }

  async create(visitor: VisitorDTO): Promise<any> {
    if (!visitor.password) {
      visitor.password = visitor.email;
    }
    const password = await bcrypt.hash(visitor.password, 10);
    visitor.password = password;
    await this.VisitorModel.create(visitor);
    if (await this.findOne(visitor.email)) {
      return this.SuccessResponse(
        'visitor created successfully',
        { created: true, visitor },
        HttpStatus.CREATED,
      );
    }
  }

  async blockVisitor(
    visitorEmail: { email: string },
    email: string,
  ): Promise<any> {
    console.log(email);
    console.log(typeof email);
    const staff = await this.staffService.findOne(email);
    const visitor = await this.findOne(visitorEmail.email);

    if (!staff) {
      throw new UnauthorizedException();
    }
    if (!visitor) {
      throw new NotFoundException();
    }

    if (visitor.status == false) {
      return {
        message: `visitor with email ${visitor.email} has been blocked`,
        data: visitor,
      };
    }
    const updatedVisitor = await this.VisitorModel.updateOne(
      { email: visitor.email },
      { status: false },
    );
    return {
      message: `visitor with email ${visitor.email} has been blocked`,
      data: updatedVisitor,
    };
  }

  async unblockVisitor(
    visitorEmail: { email: string },
    email: string,
  ): Promise<any> {
    const staff = await this.staffService.findOne(email);
    const visitor = await this.findOne(visitorEmail.email);

    if (!staff) {
      throw new UnauthorizedException();
    }
    if (!visitor) {
      throw new NotFoundException();
    }

    if (visitor.status) {
      return {
        message: `visitor with email ${visitor.email} is not blocked`,
        data: visitor,
      };
    }
    const updatedVisitor = await this.VisitorModel.updateOne(
      { email: visitor.email },
      { status: true },
    );
    return {
      message: `visitor with email ${visitor.email} has been unblocked`,
      data: updatedVisitor,
    };
  }
}
