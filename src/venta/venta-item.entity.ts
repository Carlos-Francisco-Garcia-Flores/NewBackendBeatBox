import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../productos/producto.entity';

@Entity('ventas_detalle')
export class VentaItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Venta, (venta) => venta.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_venta' })
  venta: Venta;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @Column('int')
  cantidad: number;

  @Column('numeric', { precision: 10, scale: 2 })
  precio_unitario: number;

  // Puedes usarlo si decides guardar el subtotal directo
  @Column('numeric', { precision: 10, scale: 2 })
  subtotal: number;
}
