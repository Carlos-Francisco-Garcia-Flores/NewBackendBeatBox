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
import { Usuarios } from '../auth/usuario.entity';
import { JwtCarritoStrategy } from '../common/strategies/jwt-carrito.strategy'; // Ruta según tu estructura

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Venta,
      VentaItem,
      Producto,
      Carrito,
      CarritoItem,
      Usuarios,
    ]),
  ],
  providers: [VentasService, CarritoService,JwtCarritoStrategy,],
  controllers: [VentasController],
})
export class VentaModule {}
