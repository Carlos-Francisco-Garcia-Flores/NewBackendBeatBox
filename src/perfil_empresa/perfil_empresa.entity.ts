import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Logos } from '../logos/logos.entity';

@Entity('perfilempresa') // Nombre de la tabla en la BD
export class PerfilEmpresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  mision: string;

  @Column({ type: 'text' })
  vision: string;

  @OneToOne(() => Logos) // Relación 1:1 con Logos
  @JoinColumn({ name: 'idlogo' }) // Se usa JoinColumn en relaciones 1:1
  idlogo: Logos;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedat: Date;
}
