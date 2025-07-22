import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './venta.entity';
import { VentaItem } from './venta-item.entity';
import { Producto } from '../productos/producto.entity';
import { VentasService } from './venta.service';
import { VentasController } from './venta.controller';
import { Carrito } from '../carrito/carrito.entity';
import { CarritoItem } from '../carrito/carrito-item.entity';
import { CarritoService } from '../carrito/carrito.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Venta,
      VentaItem,
      Producto,
      Carrito,
      CarritoItem,
    ]),
  ],
  providers: [VentasService, CarritoService],
  controllers: [VentasController],
})
export class VentaModule {}
