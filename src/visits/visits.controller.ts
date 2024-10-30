import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { Visit } from './schema/visits.schema';
import { VisitDTO } from './dto/visits.dto';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get()
  async findAll(): Promise<Visit[]> {
    return this.visitsService.findAll();
  }

  @Get('visits')
  async findAllForAUser(@Query() detail: any): Promise<any> {
    return this.visitsService.findAllForAUser(detail);
  }

  @Get('one')
  async findOne(@Query() code: any): Promise<any> {
    return this.visitsService.findOne(code.code);
  }

  @Get('visitor')
  async findVisitor(@Query() code: any): Promise<any> {
    return this.visitsService.findVisitor(code.code);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() visitDto: VisitDTO): Promise<Visit> {
    return this.visitsService.create(visitDto);
  }
}
