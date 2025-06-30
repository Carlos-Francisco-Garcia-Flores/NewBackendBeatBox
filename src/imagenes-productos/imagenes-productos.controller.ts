import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ImagenesProductosService } from './imagenes-productos.service';
import { CreateImagenProductoDto } from './imagen-producto.dto';

@Controller('imagenes-productos')
export class ImagenesProductosController {
  constructor(private readonly service: ImagenesProductosService) {}

  @Post()
  create(@Body() dto: CreateImagenProductoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('producto/:productoId')
  findByProducto(@Param('productoId', ParseUUIDPipe) productoId: string) {
    return this.service.findByProducto(productoId);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete(id);
  }
}
