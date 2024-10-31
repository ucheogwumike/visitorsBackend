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
import { VisitorsService } from './visitors.service';
import { Visitor } from './schema/visitor.schema';
import { VisitorDTO } from './dto/visitor.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Get()
  async findAll(): Promise<Visitor[]> {
    return this.visitorsService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() visitorDto: VisitorDTO): Promise<Visitor> {
    return this.visitorsService.create(visitorDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('temp')
  async createTemp(@Body() visitorDto: VisitorDTO): Promise<Visitor> {
    return this.visitorsService.createTemp(visitorDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('block')
  async block(
    @Request() req: any,
    @Body() visitorsEmail: { email: string },
  ): Promise<any> {
    console.log(req.user.name.email);
    return this.visitorsService.blockVisitor(
      visitorsEmail,
      req.user.name.toString(),
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('unblock')
  async unblock(
    @Request() req: any,
    @Body() visitorsEmail: { email: string },
  ): Promise<any> {
    return this.visitorsService.unblockVisitor(visitorsEmail, req.user.name);
  }
}
