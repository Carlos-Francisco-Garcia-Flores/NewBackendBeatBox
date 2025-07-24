import { IsUUID, IsInt, Min } from 'class-validator';

export class AddProductoCarritoDto {
  @IsUUID()
  productoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;


}

export class UpdateCantidadDto {
  @IsUUID()
  itemId: string;

  @IsInt()
  @Min(1)
  cantidad: number;
}
