import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Min, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precio: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  existencia: number;

  @IsOptional()
  @IsString()
  categoriaNombre?: string; 

  @IsOptional()
  @IsString()
  imagen?: string;
}

export class UpdateProductoDto extends CreateProductoDto {}
