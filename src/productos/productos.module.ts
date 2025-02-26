import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './producto.entity';
import { Categoria } from '../categorias/categoria.entity'; 
import { CategoriasModule } from '../categorias/categorias.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Categoria]), 
    CategoriasModule, 
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
