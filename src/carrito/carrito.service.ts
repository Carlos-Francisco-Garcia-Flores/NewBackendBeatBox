import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './carrito.entity';
import { CarritoItem } from './carrito-item.entity';
import { Producto } from '../productos/producto.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { AddProductoCarritoDto, UpdateCantidadDto } from './carrito.dto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepo: Repository<Carrito>,
    @InjectRepository(CarritoItem)
    private readonly itemRepo: Repository<CarritoItem>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async actualizarCantidad(
    usuario: Usuario,
    dto: UpdateCantidadDto,
  ): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(usuario);

    const item = carrito.items.find(i => i.id === dto.itemId); // ahora por ID del item

    if (!item) {
      throw new NotFoundException('Item del carrito no encontrado');
    }

    item.cantidad = dto.cantidad;
    await this.itemRepo.save(item);

    return this.obtenerCarrito(usuario);
  }

  async obtenerCarrito(usuario: Usuario): Promise<Carrito> {
    let carrito = await this.carritoRepo.findOne({
      where: { usuario: { id: usuario.id } },
      relations: ['items', 'items.producto'],
    });

    if (!carrito) {
      carrito = new Carrito();
      carrito.usuario = usuario; // relación correctamente asignada
      carrito.items = [];

      await this.carritoRepo.save(carrito);
    }

    return carrito;
  }

  async agregarProducto(
    usuario: Usuario,
    dto: AddProductoCarritoDto,
  ): Promise<Carrito> {
    if (dto.cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor que 0');
    }

    const producto = await this.productoRepo.findOneBy({ id: dto.productoId });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const carrito = await this.obtenerCarrito(usuario);
    let item = carrito.items.find(i => i.producto.id === dto.productoId);

    if (item) {
      item.cantidad += dto.cantidad;
    } else {
      item = this.itemRepo.create({
        producto,
        cantidad: dto.cantidad,
        carrito,
      });
      carrito.items.push(item);
    }

    await this.carritoRepo.save(carrito);
    return this.obtenerCarrito(usuario);
  }

  async eliminarProducto(
    usuario: Usuario,
    productoId: string,
  ): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(usuario);
    const item = carrito.items.find(i => i.producto.id === productoId);
    if (!item) throw new NotFoundException('Producto no está en el carrito');

    await this.itemRepo.remove(item);
    return this.obtenerCarrito(usuario);
  }

  async vaciarCarrito(usuario: Usuario): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(usuario);
    await this.itemRepo.remove(carrito.items);
    return this.obtenerCarrito(usuario);
  }

  



}
