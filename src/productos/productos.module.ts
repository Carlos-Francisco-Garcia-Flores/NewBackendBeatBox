import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './producto.entity';
import { Categoria } from '../categorias/categoria.entity';
import { CategoriasModule } from '../categorias/categorias.module';
import { SubcategoriasModule } from '../subcategorias/subcategorias.module';
import { Subcategoria } from '../subcategorias/subcategoria.entity';
import { LoggerModule } from '../common/loggs/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Categoria, Subcategoria]),
    CategoriasModule,
    SubcategoriasModule,
    LoggerModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
