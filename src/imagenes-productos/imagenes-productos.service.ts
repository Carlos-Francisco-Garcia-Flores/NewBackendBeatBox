import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenProducto } from './imagen-producto.entity';
import { CreateImagenProductoDto, UpdateImagenProductoDto } from './imagen-producto.dto';
import { Producto } from '../productos/producto.entity';

@Injectable()
export class ImagenesProductosService {
  constructor(
    @InjectRepository(ImagenProducto)
    private readonly imagenRepository: Repository<ImagenProducto>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(dto: CreateImagenProductoDto): Promise<ImagenProducto> {
    const producto = await this.productoRepository.findOne({
      where: { id: dto.productoId },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    const nuevaImagen = this.imagenRepository.create({
      ...dto,
      producto,
    });

    return this.imagenRepository.save(nuevaImagen);
  }

  async findAll(): Promise<ImagenProducto[]> {
    return this.imagenRepository.find({ relations: ['producto'] });
  }

  async findByProducto(productoId: string): Promise<ImagenProducto[]> {
    return this.imagenRepository.find({
      where: { producto: { id: productoId } },
      relations: ['producto'],
    });
  }

  async delete(id: string): Promise<void> {
    const imagen = await this.imagenRepository.findOneBy({ id });
    if (!imagen) throw new NotFoundException('Imagen no encontrada');
    await this.imagenRepository.remove(imagen);
  }
}
