import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePerfilEmpresaDto {

  @IsString()
  @IsNotEmpty()
  mision: string;

  @IsString()
  @IsNotEmpty()
  vision: string;

  @IsString()
  @IsOptional() // Permite que sea opcional en la actualización
  logo?: string;
  
}
