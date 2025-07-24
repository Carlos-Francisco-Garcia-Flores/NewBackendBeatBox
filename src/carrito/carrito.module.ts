// carrito.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './carrito.entity';
import { CarritoItem } from './carrito-item.entity';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { Producto } from '../productos/producto.entity';
import { Usuarios } from '../auth/usuario.entity';
import { JwtCarritoStrategy } from '../common/strategies/jwt-carrito.strategy'; // Ruta según tu estructura

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrito, CarritoItem, Producto, Usuarios]),
  ],
  controllers: [CarritoController],
  providers: [CarritoService, JwtCarritoStrategy],
})
export class CarritoModule {}
