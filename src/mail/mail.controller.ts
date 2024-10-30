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

import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async create(@Body() { code }: any, @Body() { picture }: any): Promise<any> {
    console.log(process.env.MAIL_USER);
    console.log(process.env.MAIL_PASS);
    console.log(process.env.MAIL_PORT);
    console.log(process.env.MAIL_HOST);

    return this.mailService.sendVisitPass(code, picture);
  }
}
