import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { PerfilEmpresa } from '../perfil_empresa/perfil_empresa.entity';

@Entity('logos')
export class Logos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  link: string;

  @Column({ type: 'boolean', default: false })
  vigente: boolean;

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date;

  @OneToOne(() => PerfilEmpresa, (perfilEmpresa) => perfilEmpresa.idlogo)
  perfilEmpresa: PerfilEmpresa;
}
