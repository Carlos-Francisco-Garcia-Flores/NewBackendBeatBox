import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class RegisterIncidentDto {
  @IsUUID()
  @IsNotEmpty()
  idusuario: string;
}

export class CloseIncidentDto {
  @IsUUID()
  @IsNotEmpty()
  idusuario: string;
}

export class UsernameIsBlockedDto {
  @IsUUID()
  @IsNotEmpty()
  idusuario: string;
}
