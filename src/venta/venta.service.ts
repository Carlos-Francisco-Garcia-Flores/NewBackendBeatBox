import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { VentaItem } from './venta-item.entity';
import { Carrito } from '../carrito/carrito.entity';
import { Producto } from '../productos/producto.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { CarritoService } from '../carrito/carrito.service';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
    @InjectRepository(VentaItem)
    private readonly itemRepo: Repository<VentaItem>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    private readonly carritoService: CarritoService,
  ) {}

  async procesarPagoYGuardarVenta(usuario: Usuario): Promise<Venta> {
    const carrito = await this.carritoService.obtenerCarrito(usuario);
    if (!carrito || carrito.items.length === 0) {
      throw new NotFoundException('El carrito está vacío');
    }

    const venta = this.ventaRepo.create({ usuario, items: [] });

    for (const item of carrito.items) {
      const producto = await this.productoRepo.findOneBy({ id: item.producto.id });

      if (!producto || producto.existencia < item.cantidad) {
        throw new NotFoundException(`Producto sin stock suficiente: ${producto?.nombre}`);
      }

      producto.existencia -= item.cantidad;
      await this.productoRepo.save(producto);

      const ventaItem = this.itemRepo.create({
        producto,
        cantidad: item.cantidad,
        precio: producto.precio,
        venta,
      });

      venta.items.push(ventaItem);
    }

    const ventaGuardada = await this.ventaRepo.save(venta);
    await this.carritoService.vaciarCarrito(usuario);

    return ventaGuardada;
  }

  async listarVentas(): Promise<Venta[]> {
    return this.ventaRepo.find({ relations: ['items', 'items.producto', 'usuario'] });
  }

  async obtenerVenta(id: string): Promise<Venta> {
    const venta = await this.ventaRepo.findOne({
      where: { id },
      relations: ['items', 'items.producto', 'usuario'],
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }
}
