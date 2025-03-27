import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';
import { Subcategoria } from '../subcategorias/subcategoria.entity';

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

  // Relación ManyToOne para la categoría
  @ManyToOne(() => Categoria, { nullable: true })
  @JoinColumn({ name: 'idcategoria' }) // Asegúrate de que el nombre de la columna sea 'categoriaid'
  categoria: Categoria;

  // Relación ManyToMany para las subcategorías
  @ManyToMany(() => Subcategoria)
  @JoinTable({
    name: 'producto_subcategoria', // Nombre de la tabla intermedia
    joinColumn: { name: 'producto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subcategoria_id', referencedColumnName: 'id' },
  })
  subcategorias: Subcategoria[];

  @Column({ nullable: true })
  imagen: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
