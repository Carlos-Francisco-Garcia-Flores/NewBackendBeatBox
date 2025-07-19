import { IsString, IsOptional, IsDateString, IsUUID, IsNumber } from 'class-validator';

export class CreatePerfilUsuarioDto {
  @IsUUID()
  idusuario: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsDateString()
  @IsOptional()
  fecha_nacimiento?: Date;

  @IsString()
  @IsOptional()
  genero?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  ciudad?: string;

  @IsString()
  @IsOptional()
  codigo_postal?: string;

  @IsNumber()
  @IsOptional()
  alturaI?: number;

  @IsNumber()
  @IsOptional()
  pesoI?: number;
}
