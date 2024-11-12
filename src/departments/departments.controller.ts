import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  HttpCode,
  HttpStatus,
  Request,
  //   UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './schema/department.schema';
import { DepartmentDTO } from './dto/department.dto';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() departmentDto: DepartmentDTO): Promise<Department> {
    return this.departmentsService.create(departmentDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  async update(
    @Request() req: any,
    @Body() departmentDto: DepartmentDTO,
  ): Promise<Department> {
    return this.departmentsService.update(
      req.query.name.toString(),
      departmentDto,
    );
  }
  //   @HttpCode(HttpStatus.OK)
  //   @UseGuards(AuthGuard)
  //   @Patch('block')
  //   async block(
  //     @Request() req: any,
  //     @Body() visitorsEmail: { email: string },
  //   ): Promise<any> {
  //     console.log(req.user.name.email);
  //     return this.visitorsService.blockVisitor(
  //       visitorsEmail,
  //       req.user.name.toString(),
  //     );
  //   }
}
