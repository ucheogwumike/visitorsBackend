import {
  Injectable,
  //   UnauthorizedException,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleDTO } from './dto/role.dto';
import { Role } from './schemas/role.schema';
import { Permission } from 'src/permissions/schemas/permission.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private RoleModel: Model<Role>,
    @InjectModel(Permission.name) private PermissionModel: Model<Permission>,
  ) {}

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

  async addPermisssions(name: string, permissions: any): Promise<any> {
    let badPerm = 0;
    console.log(permissions);
    const perms = [];
    const role = await this.RoleModel.findOne({ name });
    if (!role) {
      throw new NotFoundException('role not found');
    }

    for (const perm of permissions.permissions) {
      const check = await this.PermissionModel.findOne({ name: perm });
      if (!check) {
        badPerm = badPerm + 1;
        break;
      }
      perms.push(check);
    }

    if (badPerm) {
      throw new BadRequestException('permission not found');
    }

    const update = await this.RoleModel.updateOne(
      { name: role.name },
      { permissions: perms },
    );

    if (update) {
      return this.SuccessResponse(
        'updated successfully',
        { created: true, role },
        HttpStatus.CREATED,
      );
    } else {
      throw new BadRequestException('could not update');
    }
  }
}
