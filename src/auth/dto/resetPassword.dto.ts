import { Prop } from '@nestjs/mongoose';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';

export class ForgotPasswordDto {
  @Prop({ required: true })
  @IsEmail({}, { message: 'Por favor, proporciona un correo valido' })
  correo_electronico: string;
}

export class ResetPasswordDto {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Por favor, el token es obligatorio' })
  token: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres ' })
  @MaxLength(12, {message:'la contraseña debe tener como maximo un total de 12 caracteres',})
  @Matches(/^(?!.*[<>\"'`;\/\*]).+$/, { message: 'La contraseña contiene caracteres no permitidos' })
  new_password: string;
}

export class VerifySecretAnswerDto {
  @IsNotEmpty()
  @IsString({ message: 'El usuario no puede estar vacío' })
  usuario: string;

  @IsNotEmpty()
  @IsString({ message: 'La respuesta no puede estar vacía' })
  preguntaSrespuesta: string;
}

export class VerifyUsernameDto {
  @IsNotEmpty()
  @IsString({ message: 'El usuario no puede estar vacío' })
  usuario: string;
}