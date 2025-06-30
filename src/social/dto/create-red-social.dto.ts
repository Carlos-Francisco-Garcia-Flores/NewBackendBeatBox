import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateRedSocialDto {
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @IsNotEmpty()
  @Matches(
    /^(https?:\/\/)?(www\.)?(facebook|instagram|twitter|x)\.com\/[A-Za-z0-9_.-]+\/?$/,
    {
      message:
        'El enlace debe ser una URL válida de Facebook, Instagram o Twitter.',
    },
  )
  linkRed: string;
}
