import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PreguntaSecretaDto {
  @IsNotEmpty({ message: 'La pregunta no puede estar vacía' })
  @IsString({ message: 'La pregunta debe ser una cadena de texto' })
  @MaxLength(255, {
    message: 'La pregunta no puede superar los 255 caracteres',
  })
  pregunta: string;
}
