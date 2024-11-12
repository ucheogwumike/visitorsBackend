import { IsNotEmpty } from 'class-validator';

export class PermissionDTO {
  @IsNotEmpty()
  name: string;
}
