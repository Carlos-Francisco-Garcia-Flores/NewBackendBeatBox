import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Carrito } from './carrito.entity';
import { Producto } from '../productos/producto.entity';

@Entity('carrito_items')
export class CarritoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Carrito, (carrito) => carrito.items, { onDelete: 'CASCADE' })
  carrito: Carrito;

  @ManyToOne(() => Producto, { eager: true })
  producto: Producto;

  @Column('int')
  cantidad: number;
}
