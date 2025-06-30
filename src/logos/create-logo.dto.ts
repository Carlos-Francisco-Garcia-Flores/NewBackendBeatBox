import { IsBoolean, IsOptional } from 'class-validator';

export class CreateLogoDto {
  // @IsString()
  // @IsNotEmpty()
  // link: string;

  @IsBoolean()
  @IsOptional()
  vigente?: boolean;
}
