import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { VentaItem } from './venta-item.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' }) 
  usuario: Usuario;

  @OneToMany(() => VentaItem, (item) => item.venta, { cascade: true, eager: true })
  items: VentaItem[];

  @Column('numeric', { precision: 10, scale: 2 })
  monto_total: number;

  @Column({ nullable: true })
  paypal_order_id: string;

  @Column({ default: 'COMPLETADO' })
  estado_pago: string;

  @CreateDateColumn()
  fecha_venta: Date;
}
