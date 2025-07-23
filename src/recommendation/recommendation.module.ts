import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Producto } from '../productos/producto.entity';
import { Categoria } from '../categorias/categoria.entity';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller'; // ✅ IMPORTARLO
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Categoria]),
    forwardRef(() => ProductosModule),
  ],
  controllers: [RecommendationController], // ✅ AÑADIRLO AQUÍ
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
