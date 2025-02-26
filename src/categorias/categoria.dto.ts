import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;
}

export class UpdateCategoriaDto extends CreateCategoriaDto {}
