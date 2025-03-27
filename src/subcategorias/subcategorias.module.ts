import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategoria } from './subcategoria.entity';
import { SubcategoriaService } from './subcategorias.service';
import { SubcategoriaController } from './subcategorias.controller';
import { Categoria } from '../categorias/categoria.entity';
import { CategoriasModule } from '../categorias/categorias.module';


@Module({
  imports: [TypeOrmModule.forFeature([Subcategoria, Categoria]), CategoriasModule],
  providers: [SubcategoriaService],
  controllers: [SubcategoriaController],
  exports: [SubcategoriaService],
})
export class SubcategoriasModule {}
