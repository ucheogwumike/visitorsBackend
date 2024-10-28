import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Staff } from './schemas/staff.schema';
import { StaffDto } from './dto/staff.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffsService {
  constructor(@InjectModel(Staff.name) private staffModel: Model<Staff>) {}

  async findAll(): Promise<Staff[]> {
    return await this.staffModel.find().exec();
  }

  async findOne(email: string): Promise<Staff | null> {
    return await this.staffModel.findOne({ email });
  }

  async create(staff: StaffDto): Promise<any> {
    const password = await bcrypt.hash(staff.password, 10);
    staff.password = password;
    await this.staffModel.create(staff);
    if (await this.findOne(staff.email)) {
      return staff;
    }
  }
}
