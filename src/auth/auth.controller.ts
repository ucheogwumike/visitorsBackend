import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { VisitorDTO } from 'src/visitors/dto/visitor.dto';
import { StaffDto } from 'src/staffs/dto/staff.dto';
import { RoleDTO } from 'src/roles/dto/role.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  SignIn(@Body() signInDto: Record<string, any>) {
    console.log(signInDto);
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register/visitor')
  RegisterVisitor(@Body() RegisterDto: VisitorDTO, @Body() visitor: RoleDTO) {
    console.log(RegisterDto);
    return this.authService.registerVisitor(RegisterDto, visitor);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register/staff')
  Register(@Body() RegisterDto: StaffDto, @Body() staff: RoleDTO) {
    console.log(RegisterDto);
    return this.authService.registerStaff(RegisterDto, staff);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
