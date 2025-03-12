import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
  MaxLength,
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
  @Type(() => Number) // 🔹 Esto convierte el precio a número
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsNotEmpty()
  @Type(() => Number) // 🔹 Esto convierte la existencia a número
  @IsNumber({}, { message: 'La existencia debe ser un número' })
  @Min(0, { message: 'La existencia no puede ser menor a 0' })
  existencia: number;


  @IsOptional()
  @IsString()
  categoriaNombre?: string;

  @IsOptional()
  @IsString()
  imagen?: string;
}

export class UpdateProductoDto extends CreateProductoDto {}
