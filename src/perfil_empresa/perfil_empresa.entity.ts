import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('perfilempresa') // Nombre de la tabla en la BD
export class PerfilEmpresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  eslogan: string;

  @Column({ type: 'text' })
  mision: string;

  @Column({ type: 'text' })
  vision: string;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
