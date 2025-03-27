import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, Matches} from 'class-validator';

export class LoginDto {
  @Prop({ required: true })
  @IsNotEmpty({ message: 'Por favor, ingrese su usuario o correo electrónico' })
  @Matches(/^[a-zA-Z0-9@.]+$/, {
    message: 'El usuario o correo electrónico contiene caracteres no permitidos',
  })
  usuarioOEmail: string;;

  @Prop({ required: true })
  @IsNotEmpty({ message: 'Por favor, ingrese su contraseña ' })
  @Matches(/^(?!.*[<>\"'`;\/\*]).+$/, { message: 'La contraseña contiene caracteres no permitidos' })
  password: string;
}
