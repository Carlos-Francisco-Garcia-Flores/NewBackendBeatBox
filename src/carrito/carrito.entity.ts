import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { CarritoItem } from './carrito-item.entity';

@Entity('carritos')
export class Carrito {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.carritos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioid' }) // ← según el nombre en tu tabla
  usuario: Usuario;

  @OneToMany(() => CarritoItem, (item) => item.carrito, { cascade: true })
  items: CarritoItem[];

  @CreateDateColumn()
  creado_en: Date;

  @UpdateDateColumn()
  actualizado_en: Date;
}
