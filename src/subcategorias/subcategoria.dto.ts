import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateSubcategoriaDto {
  @IsInt()
  @IsNotEmpty()
  id_categoria: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;
}

export class UpdateSubcategoriaDto {
  @IsString()
  @IsOptional()
  nombre: string;
}
