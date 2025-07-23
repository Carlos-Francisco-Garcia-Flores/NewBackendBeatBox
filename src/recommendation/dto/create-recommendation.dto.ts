import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRecommendationDto {
  @IsString()
  @IsNotEmpty()
  producto: string;
}

export class CreateCartRecommendationDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  productos: string[];
}
