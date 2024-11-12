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
import { PermissionsService } from './permissions.service';
import { Permission } from './schemas/permission.schema';
import { PermissionDTO } from './dto/permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() permissionDto: PermissionDTO): Promise<Permission> {
    return this.permissionService.create(permissionDto);
  }
}
