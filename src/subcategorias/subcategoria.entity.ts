import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, } from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';

@Entity('subcategorias')
export class Subcategoria {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Categoria, { nullable: true })
  @JoinColumn({ name: 'id_categoria' }) 
  categoria: Categoria;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
