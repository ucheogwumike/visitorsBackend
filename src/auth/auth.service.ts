import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffsService } from 'src/staffs/staffs.service';
import { VisitorsService } from 'src/visitors/visitors.service';
import { RolesService } from 'src/roles/roles.service';
import { VisitorDTO } from 'src/visitors/dto/visitor.dto';
import { RoleDTO } from 'src/roles/dto/role.dto';

import * as bcrypt from 'bcrypt';
import { StaffDto } from 'src/staffs/dto/staff.dto';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffsService,
    private jwtService: JwtService,
    private visitorService: VisitorsService,
    private rolesService: RolesService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: any }> {
    console.log(email);
    let user: any;
    const staff = await this.staffService.findOne(email);
    const visitor = await this.visitorService.findOne(email);
    if (staff) {
      user = staff;
    } else if (visitor) {
      user = visitor;
    } else {
      throw new NotFoundException('user not found');
    }

    // console.log(password, staff?.password);
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.email, name: user.email };
    console.log(await this.jwtService.signAsync(payload));
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async registerVisitor(
    visitorBody: VisitorDTO,
    roleVisitor: RoleDTO,
  ): Promise<{ access_token: string; authUser: any }> {
    // const staff = await this.staffService.findOne(email);
    const visitor = await this.visitorService.findOne(visitorBody.email);

    if (visitor) {
      console.log(visitor);
      throw new BadRequestException('visitor already exists');
    }

    // console.log(password, staff?.password);
    // if (!(await bcrypt.compare(password, user.password))) {
    //   throw new UnauthorizedException();
    // }
    let role = await this.rolesService.findOne('visitor');

    if (!role) {
      console.log(role);
      role = await this.rolesService.create(roleVisitor);
      console.log(role);
    }

    visitorBody.role = role;

    const newVisitor = await this.visitorService.create(visitorBody);

    console.log(role, newVisitor);
    const payload = { sub: newVisitor.email, name: newVisitor.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      authUser: newVisitor,
    };
  }

  async registerStaff(
    staffBody: StaffDto,
    roleStaff: any,
  ): Promise<{ access_token: string; authUser: any }> {
    const staff = await this.staffService.findOne(staffBody.email);

    if (staff) {
      throw new BadRequestException('staff already exists');
    }

    // console.log(password, staff?.password);
    // if (!(await bcrypt.compare(password, user.password))) {
    //   throw new UnauthorizedException();
    // }
    console.log(roleStaff['staff']);
    if (roleStaff['staff'] == 'admin') {
      let role = await this.rolesService.findOne('admin');
      console.log(role, 'admin');
      if (!role) {
        role = await this.rolesService.create(roleStaff);
      }
      staffBody.role = role;
    } else if (roleStaff['staff'] == 'staff') {
      let role = await this.rolesService.findOne('staff');
      console.log(role, 'staff');
      if (!role) {
        role = await this.rolesService.create(roleStaff);
      }
      staffBody.role = role;
    }

    console.log(staffBody.role);
    const newStaff = await this.staffService.create(staffBody);

    const payload = { sub: newStaff.email, name: newStaff.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      authUser: newStaff,
    };
  }
}
