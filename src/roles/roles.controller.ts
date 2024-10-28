import {
  Controller,
  Body,
  Get,
  Post,
  //   Patch,
  HttpCode,
  HttpStatus,
  //   Request,
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

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() roleDto: RoleDTO): Promise<Role> {
    return this.rolesService.create(roleDto);
  }
}
