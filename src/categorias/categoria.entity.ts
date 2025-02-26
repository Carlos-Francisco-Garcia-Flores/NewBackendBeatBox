import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Producto } from '../productos/producto.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
