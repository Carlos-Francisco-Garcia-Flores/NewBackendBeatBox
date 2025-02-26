import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Incident } from '../incident/incident.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario: string;

  @Column()
  password: string;

  @Column({ unique: true })
  correo_electronico: string;

  @Column({ nullable: true })
  telefono: string;

  @Column()
  estado: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  bloqueado: boolean;

  @Column({ nullable: true })
  sessionid: string;

  // Relación uno a uno con Incident
  @OneToOne(() => Incident, (incident) => incident.usuario, { cascade: true })
  incidente: Incident;
}
