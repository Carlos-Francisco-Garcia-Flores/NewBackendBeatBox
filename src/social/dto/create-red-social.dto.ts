import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateRedSocialDto {
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @IsNotEmpty()
  @IsUrl()
  linkRed: string;
}