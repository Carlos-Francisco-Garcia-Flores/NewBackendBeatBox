import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Incident } from '../incident/incident.entity';
import { OneToMany } from 'typeorm';
import { Carrito } from '../carrito/carrito.entity';


@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid') // Genera un ID único para cada usuario
  id: string;

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
  sessionId: string;

  // Relación uno a uno con Incident
  @OneToOne(() => Incident, (incident) => incident.usuario, { cascade: true })
  incidente: Incident;

  @OneToMany(() => Carrito, (carrito) => carrito.usuario)
  carritos: Carrito[];
}
