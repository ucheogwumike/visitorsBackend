import { IsNotEmpty } from 'class-validator';

export class DepartmentDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;
}
