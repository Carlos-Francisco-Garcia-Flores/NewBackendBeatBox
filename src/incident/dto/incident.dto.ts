import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class RegisterIncidentDto {
  @IsUUID()
  @IsNotEmpty()
  idusuario: number;
}

export class CloseIncidentDto {
  @IsUUID()
  @IsNotEmpty()
  idusuario: number;
}

export class UsernameIsBlockedDto {
  @IsUUID()
  @IsNotEmpty()
  idusuario: number;

}
