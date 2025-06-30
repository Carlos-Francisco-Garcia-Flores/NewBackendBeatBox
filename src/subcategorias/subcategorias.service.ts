import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategoria } from './subcategoria.entity';
import {
  CreateSubcategoriaDto,
  UpdateSubcategoriaDto,
} from './subcategoria.dto';
import { Categoria } from '../categorias/categoria.entity';

@Injectable()
export class SubcategoriaService {
  constructor(
    @InjectRepository(Subcategoria)
    private subcategoriaRepository: Repository<Subcategoria>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async create(
    createSubcategoriaDto: CreateSubcategoriaDto,
  ): Promise<Subcategoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id: createSubcategoriaDto.id_categoria },
    });

    if (!categoria) {
      throw new Error('Categoria no encontrada');
    }

    const subcategoria = this.subcategoriaRepository.create({
      ...createSubcategoriaDto,
      categoria, // Asignamos la relación con la categoría
    });

    return this.subcategoriaRepository.save(subcategoria);
  }

  async findAll(): Promise<Subcategoria[]> {
    return this.subcategoriaRepository.find({
      relations: ['categoria'], // Asegúrate de cargar la relación con 'categoria'
    });
  }

  async findOne(id: number): Promise<Subcategoria> {
    return this.subcategoriaRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });
  }

  async update(
    id: number,
    updateSubcategoriaDto: UpdateSubcategoriaDto,
  ): Promise<Subcategoria> {
    const subcategoria = await this.subcategoriaRepository.findOne({
      where: { id },
    });
    if (!subcategoria) {
      throw new Error('Subcategoría no encontrada');
    }

    subcategoria.nombre = updateSubcategoriaDto.nombre;

    return this.subcategoriaRepository.save(subcategoria);
  }

  async remove(id: number): Promise<void> {
    await this.subcategoriaRepository.delete(id);
  }

  // Método para obtener las subcategorías por categoría
  async findByCategoria(categoriaId: number): Promise<Subcategoria[]> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['subcategorias'], // Asegúrate de que la categoría tenga la relación 'subcategorias'
    });

    if (!categoria) {
      throw new Error(`Categoría con ID ${categoriaId} no encontrada`);
    }

    return categoria.subcategorias; // Devolvemos las subcategorías relacionadas con esa categoría
  }
}
