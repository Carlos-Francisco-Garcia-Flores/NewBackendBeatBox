import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('int')
  existencia: number;

  @ManyToOne(() => Categoria, { nullable: true })
  @JoinColumn({ name: 'idcategoria' })
  categoria: Categoria;

  @Column({ type: 'int', nullable: true }) 
  idcategoria: number;

  @Column({ nullable: true })
  imagen: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
