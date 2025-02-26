import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto, UpdateProductoDto } from './producto.dto';
import { Categoria } from '../categorias/categoria.entity';
import { cloudinary } from '../cloudinary/cloudinary.provider';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({ relations: ['categoria'] });
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id }, relations: ['categoria'] });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async create(dto: CreateProductoDto, imagen?: string): Promise<Producto> {
    let idcategoria = null;

    if (dto.categoriaNombre) {
      const categoria = await this.categoriaRepository.findOne({ where: { nombre: dto.categoriaNombre } });
      if (!categoria) throw new NotFoundException(`No existe la categoría "${dto.categoriaNombre}"`);
      idcategoria = categoria.id;
    }

    let imagenFinal = dto.imagen;
    if (imagen) {
      const uploadResult = await cloudinary.uploader.upload(imagen, { folder: 'productos' });
      imagenFinal = uploadResult.secure_url;
    }

    const nuevoProducto = this.productoRepository.create({
      ...dto,
      idcategoria,
      imagen: imagenFinal,
    });

    return await this.productoRepository.save(nuevoProducto);
  }

  async update(id: string, dto: UpdateProductoDto, imagen?: string): Promise<Producto> {
    const producto = await this.findOne(id);

    let idcategoria = producto.idcategoria;
    if (dto.categoriaNombre) {
      const categoria = await this.categoriaRepository.findOne({ where: { nombre: dto.categoriaNombre } });
      if (!categoria) throw new NotFoundException(`No existe la categoría "${dto.categoriaNombre}"`);
      idcategoria = categoria.id;
    }

    let imagenFinal = producto.imagen;
    if (imagen) {
      const uploadResult = await cloudinary.uploader.upload(imagen, { folder: 'productos' });
      imagenFinal = uploadResult.secure_url;
    }

    await this.productoRepository.update(id, { ...dto, idcategoria, imagen: imagenFinal });
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const producto = await this.findOne(id);
    const publicId = this.extractPublicIdFromUrl(producto.imagen);

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(`Error al eliminar la imagen de Cloudinary: ${error.message}`);
      }
    }

    await this.productoRepository.remove(producto);
  }

  private extractPublicIdFromUrl(url: string): string | null {
    const regex = /\/([^/]+)\.[a-zA-Z]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
