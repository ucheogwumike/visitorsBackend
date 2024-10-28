import { IsNotEmpty } from 'class-validator';

export class VisitDTO {
  @IsNotEmpty()
  rescheduled: boolean;

  @IsNotEmpty()
  dateUpdated: Date;

  @IsNotEmpty()
  dateOfVisit: string;

  @IsNotEmpty()
  dateCreated: Date;

  @IsNotEmpty()
  signIn: string;

  @IsNotEmpty()
  signOut: Date;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  visitorEmail: string;

  @IsNotEmpty()
  staffEmail: string;

  @IsNotEmpty()
  departmentName: string;

  visitor?: any;

  staff?: any;

  department?: any;

  @IsNotEmpty()
  room: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  code: Promise<string>;
}
