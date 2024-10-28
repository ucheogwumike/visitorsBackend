import {
  Controller,
  Body,
  Get,
  Post,
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

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() visitDto: VisitDTO): Promise<Visit> {
    return this.visitsService.create(visitDto);
  }
}
