import {
  Injectable,
  //   UnauthorizedException,
  //   NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleDTO } from './dto/role.dto';
import { Role } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) {}

  SuccessResponse(
    message: string,
    data: any = {},
    code: HttpStatus = HttpStatus.OK,
  ) {
    return { data, message, error: false, code };
  }

  async findAll(): Promise<Role[]> {
    return await this.RoleModel.find().exec();
  }

  async findOne(name: string): Promise<Role | null> {
    return await this.RoleModel.findOne({ name });
  }

  async create(role: RoleDTO): Promise<any> {
    if (await this.findOne(role.name)) {
      throw new BadRequestException('role name already exists');
    }

    await this.RoleModel.create(role);
    if (await this.findOne(role.name)) {
      return this.SuccessResponse(
        'role created successfully',
        { created: true, role },
        HttpStatus.CREATED,
      );
    }
  }
}
