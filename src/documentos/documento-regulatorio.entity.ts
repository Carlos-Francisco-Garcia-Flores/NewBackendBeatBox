// src/documentos-regulatorios/entities/documento-regulatorio.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('documentosregulatorios') // Nombre de la tabla en PostgreSQL
export class DocumentoRegulatorio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column()
  descripcion: string;

  @Column('decimal')
  version: string; // Se mantiene como string para manejar versiones como x.0

  @CreateDateColumn()
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ default: true })
  vigente: boolean;

  @Column({ default: false })
  eliminado: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
