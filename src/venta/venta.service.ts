import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { VentaItem } from './venta-item.entity';
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

    let montoTotal = 0;
    const venta = this.ventaRepo.create({ usuario, items: [], monto_total: 0 });

    for (const item of carrito.items) {
      const producto = await this.productoRepo.findOneBy({ id: item.producto.id });
      if (!producto) {
        throw new NotFoundException(`Producto no encontrado: ${item.producto.nombre}`);
      }
      if (producto.existencia < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${producto.nombre}`);
      }

      const subtotal = Number(producto.precio) * item.cantidad;
      montoTotal += subtotal;
      producto.existencia -= item.cantidad;
      await this.productoRepo.save(producto);

      const ventaItem = this.itemRepo.create({
        producto,
        cantidad: item.cantidad,
        precio_unitario: Number(producto.precio),
        venta,
      });

      venta.items.push(ventaItem);
    }

    venta.monto_total = montoTotal;
    const ventaGuardada = await this.ventaRepo.save(venta);
    await this.carritoService.vaciarCarrito(usuario);

    return ventaGuardada;
  }

  async listarVentas(): Promise<Venta[]> {
    return this.ventaRepo.find({
      relations: ['items', 'items.producto', 'usuario'],
      order: { fecha_venta: 'DESC' },
    });
  }

  async obtenerVenta(id: string): Promise<Venta> {
    const venta = await this.ventaRepo.findOne({
      where: { id },
      relations: ['items', 'items.producto', 'usuario'],
    });

    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  async listarVentasDeUsuario(usuario: Usuario): Promise<Venta[]> {
    return this.ventaRepo.find({
      where: { usuario: { id: usuario.id } },
      relations: ['items', 'items.producto'],
      order: { fecha_venta: 'DESC' },
    });
  }

    async crearVentaConDatos(
      usuario: Usuario,
      data: {
        metodo_pago: string;
        monto_total: number;
        paypal_order_id: string;
        estado_pago: string;
        productos: {
          producto_id: string;
          cantidad: number;
          precio_unitario: number;
        }[];
      },
    ): Promise<Venta> {
      let montoTotal = 0;

      // Paso 1: Crear y guardar primero la venta sin los items
      const venta = this.ventaRepo.create({
        usuario,
        monto_total: 0,
        paypal_order_id: data.paypal_order_id,
        estado_pago: data.estado_pago,
      });
      const ventaGuardada = await this.ventaRepo.save(venta);

      // Paso 2: Crear los items con referencia a la venta guardada
      const ventaItems: VentaItem[] = [];

      for (const item of data.productos) {
        const producto = await this.productoRepo.findOneBy({ id: item.producto_id });
        if (!producto) throw new NotFoundException(`Producto no encontrado`);
        if (producto.existencia < item.cantidad)
          throw new BadRequestException(`Stock insuficiente para ${producto.nombre}`);

        const subtotal = item.precio_unitario * item.cantidad;
        montoTotal += subtotal;

        producto.existencia -= item.cantidad;
        await this.productoRepo.save(producto);

        const ventaItem = this.itemRepo.create({
          producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          venta: ventaGuardada, // ahora sí con ID
        });

        ventaItems.push(ventaItem);
      }

      // Paso 3: Guardar los items en la base de datos
      await this.itemRepo.save(ventaItems);

      // Paso 4: Actualizar el monto total en la venta
      ventaGuardada.monto_total = montoTotal;
      await this.ventaRepo.save(ventaGuardada);

      // Paso 5: Vaciar carrito
      await this.carritoService.vaciarCarrito(usuario);

      return {
        ...ventaGuardada,
        items: ventaItems,
      };
    }


    async actualizarVenta(id: string, datos: Partial<Venta>): Promise<Venta> {
    const venta = await this.ventaRepo.findOneBy({ id });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }

    // Actualiza solo los campos que envíen en datos
    Object.assign(venta, datos);

    return this.ventaRepo.save(venta);
  }


}
