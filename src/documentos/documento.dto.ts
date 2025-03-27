// src/documentos-regulatorios/dto/documento.dto.ts
import { IsString, IsOptional, IsDate } from 'class-validator';

export class CreateDocumentoDto {
  @IsString()
  tipo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsDate()
  fechaInicio: Date;

  @IsOptional()
  @IsDate()
  fechaFin: Date;
}

export class UpdateDocumentoDto {
  @IsString()
  @IsOptional()
  descripcion?: string;
}
