import { IsNotEmpty } from 'class-validator';

export class StaffDto {
  _id?: string;
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  MiddleName: string;

  regNumber: string;

  department: string;
  email: string;

  password: string;

  phone: string;

  profile_picture: string;

  status: boolean;

  limit: number;

  roleName: string;
  role?: any;
}
