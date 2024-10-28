import { IsNotEmpty } from 'class-validator';

export class VisitorDTO {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;

  MiddleName: string;

  regNumber: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  email: string;
  password: string;
  @IsNotEmpty()
  phone: string;
  company: string;

  profile_picture: string;
  roleName: string;
  role?: any;
  status: boolean;
}
