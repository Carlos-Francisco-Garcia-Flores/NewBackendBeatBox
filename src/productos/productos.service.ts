import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto, UpdateProductoDto } from './producto.dto';
import { Categoria } from '../categorias/categoria.entity';
import { Subcategoria } from '../subcategorias/subcategoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Subcategoria)
    private readonly subcategoriaRepository: Repository<Subcategoria>,
  ) {}

  // Obtener todos los productos con sus relaciones de categoria y subcategorias
  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      relations: ['categoria', 'subcategorias'], // Incluimos subcategorias en la consulta
    });
  }

  // Obtener un producto por su ID, incluyendo las relaciones de categoria y subcategorias
  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'subcategorias'],
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  // Crear un nuevo producto con su categoria y subcategorias
  async create(dto: CreateProductoDto): Promise<Producto> {
    let categoria: Categoria | null = null;

    // Buscar la categoría basada en el nombre, si se proporciona
    if (dto.categoriaNombre) {
      categoria = await this.categoriaRepository.findOne({
        where: { nombre: dto.categoriaNombre },
      });
      if (!categoria)
        throw new NotFoundException(
          `No existe la categoría "${dto.categoriaNombre}"`,
        );
    }

    // Obtener subcategorías desde los IDs proporcionados en el DTO
    let subcategorias = [];
    if (dto.subcategorias && dto.subcategorias.length > 0) {
      subcategorias = await this.subcategoriaRepository.findByIds(
        dto.subcategorias,
      );
    }

    // Crear el nuevo producto, asignando las subcategorías y la categoría
    const nuevoProducto = this.productoRepository.create({
      ...dto,
      precio: Number(dto.precio),
      existencia: Number(dto.existencia),
      categoria, // Asignamos el objeto completo de la categoria
      subcategorias, // Asociamos las subcategorías al producto
    });

    // Guardar el nuevo producto
    return await this.productoRepository.save(nuevoProducto);
  }

  // Actualizar un producto existente, incluyendo las subcategorías
  async update(id: string, dto: UpdateProductoDto): Promise<Producto> {
    // Buscar el producto con sus relaciones
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'subcategorias'],
    });

    if (!producto) {
      throw new NotFoundException(`No se encontró el producto con ID: ${id}`);
    }

    // Actualizar la categoría si es necesario
    if (dto.categoriaNombre) {
      const categoriaEncontrada = await this.categoriaRepository.findOne({
        where: { nombre: dto.categoriaNombre },
      });
      if (!categoriaEncontrada) {
        throw new NotFoundException(
          `No existe la categoría "${dto.categoriaNombre}"`,
        );
      }
      producto.categoria = categoriaEncontrada;
    }

    // Extraer subcategorias y categoriaNombre del DTO para evitar sobrescribirlos
    const { subcategorias, categoriaNombre, ...restDto } = dto;

    // Actualizar otros valores del producto
    Object.assign(producto, restDto);

    // Guardar el producto primero para asegurarnos de que existe
    await this.productoRepository.save(producto);

    // Manejar las subcategorías si se proporcionaron
    if (subcategorias !== undefined) {
      // Usar el queryBuilder para establecer las relaciones
      const queryRunner =
        this.productoRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Primero, eliminar todas las relaciones existentes
        await queryRunner.manager
          .createQueryBuilder()
          .relation(Producto, 'subcategorias')
          .of(producto)
          .remove(producto.subcategorias.map((sub) => sub.id));

        // Luego, si hay subcategorías nuevas, añadirlas
        if (subcategorias.length > 0) {
          await queryRunner.manager
            .createQueryBuilder()
            .relation(Producto, 'subcategorias')
            .of(producto)
            .add(subcategorias);
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(`Error al actualizar subcategorías: ${error.message}`);
      } finally {
        await queryRunner.release();
      }
    }

    // Volver a cargar el producto con todas sus relaciones
    return await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'subcategorias'],
    });
  }

  // Eliminar un producto, incluyendo la eliminación de su imagen si está en Cloudinary
  async delete(id: string): Promise<void> {
    const producto = await this.findOne(id);

    // Eliminar el producto de la base de datos
    await this.productoRepository.remove(producto);
  }

  // Buscar productos por categoría
  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    const productos = await this.productoRepository.find({
      where: { categoria: { id: categoriaId } },
      relations: ['categoria', 'subcategorias'],
    });

    if (!productos.length) {
      throw new NotFoundException(
        `No hay productos en la categoría con ID: ${categoriaId}`,
      );
    }

    return productos;
  }

  // Buscar productos por subcategoría
  async findBySubcategoria(subcategoriaId: number): Promise<Producto[]> {
    const productos = await this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('producto.subcategorias', 'subcategoria')
      .where('subcategoria.id = :subcategoriaId', { subcategoriaId })
      .getMany();

    if (!productos.length) {
      throw new NotFoundException(
        `No hay productos en la subcategoría con ID: ${subcategoriaId}`,
      );
    }

    return productos;
  }
  async findByNombre(nombre: string): Promise<Producto | null> {
  return await this.productoRepository.findOne({
    where: { nombre },
    relations: ['categoria', 'subcategorias'],
  });
}
}
// 