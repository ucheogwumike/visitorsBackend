import {
  Injectable,
  //   UnauthorizedException,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from './schema/department.schema';
import { DepartmentDTO } from './dto/department.dto';
// import { StaffsService } from 'src/staffs/staffs.service';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private DepartmentModel: Model<Department>,
    // private staffService: StaffsService,
  ) {}

  SuccessResponse(
    message: string,
    data: any = {},
    code: HttpStatus = HttpStatus.OK,
  ) {
    return { data, message, error: false, code };
  }

  async findAll(): Promise<Department[]> {
    return await this.DepartmentModel.find().exec();
  }

  async findOne(name: string): Promise<Department | null> {
    return await this.DepartmentModel.findOne({ name });
  }

  async create(department: DepartmentDTO): Promise<any> {
    if (await this.findOne(department.name)) {
      throw new BadRequestException('departnment name already exists');
    }

    await this.DepartmentModel.create(department);
    if (await this.findOne(department.name)) {
      return this.SuccessResponse(
        'department created successfully',
        { created: true, department },
        HttpStatus.CREATED,
      );
    }
  }

  async update(name: string, dept: any): Promise<any> {
    const department = await this.DepartmentModel.findOne({ name });
    if (!department) {
      throw new NotFoundException('department not found');
    }
    console.log(dept);
    const update = await this.DepartmentModel.updateOne(
      { name: department.name },
      dept,
    );

    if (update) {
      return this.SuccessResponse(
        'updated successfully',
        { created: true, department },
        HttpStatus.CREATED,
      );
    } else {
      throw new BadRequestException('could not update');
    }
  }
}
