import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePerfilEmpresaDto {
  @IsString()
  @IsOptional()
  mision: string;

  @IsString()
  @IsOptional()
  vision: string;

  @IsInt()
  @IsOptional()
  idlogo?: number;
}
