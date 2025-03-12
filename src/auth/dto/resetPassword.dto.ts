import { Prop } from '@nestjs/mongoose';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
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
  @MaxLength(12, {
    message:
      'El nombre de usuario debe tener como maximo un total de 12 caracteres',
  })
  new_password: string;
}
