export class CreateImagenProductoDto {
  url: string;
  descripcion?: string;
  productoId: string;
}

export class UpdateImagenProductoDto {
  url?: string;
  descripcion?: string;
}
