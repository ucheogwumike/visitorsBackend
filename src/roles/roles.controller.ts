import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  HttpCode,
  HttpStatus,
  Request,
  //   UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './schemas/role.schema';
import { RoleDTO } from './dto/role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get('one')
  async findOne(@Request() req: any): Promise<Role | null> {
    return this.rolesService.findOne(req.query.name.toString());
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() roleDto: RoleDTO): Promise<Role> {
    return this.rolesService.create(roleDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('add')
  async addPermission(
    @Body() permissions: [],
    @Request() req: any,
  ): Promise<Role> {
    return this.rolesService.addPermisssions(
      req.query.name.toString(),
      permissions,
    );
  }
}
