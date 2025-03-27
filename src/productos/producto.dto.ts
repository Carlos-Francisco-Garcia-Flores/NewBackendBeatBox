import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
  MaxLength,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  precio: number;

  @IsNotEmpty()
  @IsNumber()
  existencia: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  subcategorias?: number[]; // IDs de las subcategorías que se asignarán

  @IsOptional()
  @IsString()
  categoriaNombre?: string;

  @IsOptional()
  @IsString()
  imagen?: string;
}


export class UpdateProductoDto extends CreateProductoDto {}
