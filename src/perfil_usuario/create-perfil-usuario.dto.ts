import { IsString, IsOptional, IsDateString, IsUUID, IsNumber } from 'class-validator';

export class CreatePerfilUsuarioDto {
   @IsUUID()
  @IsOptional()
  id?: string; 

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
  nombre_contacto_emergencia?: string;

  @IsString()
  @IsOptional()
  telefono_contacto_emergencia?: string;

  @IsNumber()
  @IsOptional()
  peso_inicial?: number;

  @IsNumber()
  @IsOptional()
  altura?: number;

    @IsNumber()
  @IsOptional()
  imc?: number;

  @IsNumber()
  @IsOptional()
  peso_objetivo?: number;


}
