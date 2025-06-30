import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagenProducto } from './imagen-producto.entity';
import { ImagenesProductosController } from './imagenes-productos.controller';
import { ImagenesProductosService } from './imagenes-productos.service';
import { Producto } from '../productos/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImagenProducto, Producto])],
  controllers: [ImagenesProductosController],
  providers: [ImagenesProductosService],
})
export class ImagenesProductosModule {}
