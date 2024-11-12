import {
  Injectable,
  //   UnauthorizedException,
  //   NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PermissionDTO } from './dto/permission.dto';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private PermissionModel: Model<Permission>,
  ) {}

  SuccessResponse(
    message: string,
    data: any = {},
    code: HttpStatus = HttpStatus.OK,
  ) {
    return { data, message, error: false, code };
  }

  async findAll(): Promise<Permission[]> {
    return await this.PermissionModel.find().exec();
  }

  async findOne(name: string): Promise<Permission | null> {
    return await this.PermissionModel.findOne({ name });
  }

  async create(permission: PermissionDTO): Promise<any> {
    if (await this.findOne(permission.name)) {
      throw new BadRequestException('permission already exists');
    }

    await this.PermissionModel.create(permission);
    if (await this.findOne(permission.name)) {
      return this.SuccessResponse(
        'permission created successfully',
        { created: true, permission },
        HttpStatus.CREATED,
      );
    }
  }
}
