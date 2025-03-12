import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return categoria;
  }

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    const existe = await this.categoriaRepository.findOne({
      where: { nombre: dto.nombre },
    });
    if (existe)
      throw new ConflictException('Ya existe una categoría con este nombre');

    const nuevaCategoria = this.categoriaRepository.create(dto);
    return await this.categoriaRepository.save(nuevaCategoria);
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
  }
}
