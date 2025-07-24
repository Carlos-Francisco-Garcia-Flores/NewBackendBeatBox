import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Carrito } from './carrito.entity';
import { Producto } from '../productos/producto.entity';

@Entity('carritoitems')
export class CarritoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Carrito, (carrito) => carrito.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carritoid' }) // nombre real de la columna en tu base de datos
  carrito: Carrito;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'productoid' }) // <- nombre real
  producto: Producto;

  @Column('int')
  cantidad: number;
}
