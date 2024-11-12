import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  Req,
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
  async findAll(@Req() request: any): Promise<Visit[]> {
    return this.visitsService.findAll(request.query);
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

  @HttpCode(HttpStatus.OK)
  @Patch()
  async update(@Body() visitDto: VisitDTO): Promise<any> {
    return this.visitsService.update(visitDto); //update(visitDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('date')
  async updateDate(@Body() visit: any): Promise<any> {
    return this.visitsService.reschedule({
      code: visit.code,
      date: visit.date,
    }); //update(visitDto);
  }
}
