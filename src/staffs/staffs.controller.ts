import { Controller, Body, Get, Post } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { Staff } from './schemas/staff.schema';
import { StaffDto } from './dto/staff.dto';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Get()
  async findAll(): Promise<Staff[]> {
    return this.staffsService.findAll();
  }

  @Post()
  async create(@Body() staffDto: StaffDto): Promise<Staff> {
    return this.staffsService.create(staffDto);
  }
}
