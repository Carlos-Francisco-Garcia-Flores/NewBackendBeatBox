import { Prop } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  isNotEmpty,
  IsUUID,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @Prop({ required: true })
  @IsEmail({}, { message: 'Por favor, ingrese un correo valido' })
  correo_electronico: string;

  @IsNotEmpty()
  @Prop({ required: true })
  @MinLength(6, {
    message:
      'El nombre de usuario debe tener al menos un total de  6 caracteres',
  })
  @MaxLength(12, {
    message:
      'El nombre de usuario debe tener como maximo un total de 12 caracteres',
  })
  @Matches(/^[a-zA-Z0-9]{6,12}$/, {
    message: 'El nombre de usuario debe contener solo caracteres alfanumericos',
  })
  usuario: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: 'Por favor, ingrese su contraseña' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?!.*[<>\"'`;\/\*]).+$/, { message: 'La contraseña contiene caracteres no permitidos' })
  password: string;

  @IsNotEmpty({ message: 'Por favor, seleccione una pregunta válida' })
  @IsUUID('4', { message: 'El ID de la pregunta debe ser un UUID válido' })
  preguntaSecretaId: string;

  @Prop({required: true})
  @IsNotEmpty({ message: 'Por favor agregue una respuesta validad'})
  preguntaSrespuesta: string;

  @Prop({ default: false })
  estado: boolean;
}

export class ActivationDto {
  @Prop({ required: true })
  @IsEmail({}, { message: 'Por favor, proporciona un email válido' })
  correo_electronico: string;

  @Prop({ required: true })
  @IsString({ message: 'Por favor, proporciona un codigo otp valido' })
  otp: string;
}
