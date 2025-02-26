// src/configuracion/dto/create-configuracion.dto.ts
import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class CreateConfiguracionDto {
  @IsOptional() // Opción para que sea opcional al crear
  @IsInt()
  @IsPositive()
  maxFailedAttempts: number;

  @IsOptional() // Opción para que sea opcional al crear
  @IsInt()
  @IsPositive()
  lockTimeMinutes: number;
}


export class UpdateConfiguracionDto {
    @IsInt()
    @IsPositive()
    maxFailedAttempts: number;
  
    @IsInt()
    @IsPositive()
    lockTimeMinutes: number;
  }