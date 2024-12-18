import {
  Controller,
  Body,
  Get,
  Post,
  // Res,
  Req,
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
  async findAll(@Req() request: any): Promise<Visitor[]> {
    return this.visitorsService.findAll(request.query);
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
  //@UseGuards(AuthGuard)
  @Patch('block')
  async block(
    // @Request() req: any,
    @Body() visitorsEmail: { email: string },
  ): Promise<any> {
    //console.log(req.user.name.email);
    return this.visitorsService.blockVisitor(
      visitorsEmail,
      //req.user.name.toString(),
    );
  }

  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthGuard)
  @Patch('unblock')
  async unblock(
    //@Request() req: any,
    @Body() visitorsEmail: { email: string },
  ): Promise<any> {
    return this.visitorsService.unblockVisitor(visitorsEmail);
  }

  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthGuard)
  @Patch('profile')
  async profile(
    //@Request() req: any,
    @Body() visitorsEmail: { email: string; picture: any },
  ): Promise<any> {
    return this.visitorsService.updateProfilePic(visitorsEmail);
  }
}
