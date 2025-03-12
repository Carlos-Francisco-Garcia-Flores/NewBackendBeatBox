import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('incidencias')
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @Column({ type: 'uuid' }) 
  idusuario: string;


  @Column({ default: 0 })
  failedattempts: number;

  @Column({ default: 0 })
  totalfailedattempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lastattempts: Date;

  @Column({ default: 'open' })
  state: string;

  @Column({ default: false })
  isblocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  blockexpiresat: Date;
}
