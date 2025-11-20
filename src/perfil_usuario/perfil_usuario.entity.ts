import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { PesoM } from '../peso-m/peso-m.entity';

@Entity('perfil_usuarios')
export class PerfilUsuarios {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @Column({ default: '' })
  nombre: string;

  @Column({ default: '' })
  apellidos: string;

  @Column({ default: '' })
  telefono: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ default: '' })
  genero: string;

  @Column({ default: '' })
  nombre_contacto_emergencia?: string;
  
  @Column({ default: '' })
  telefono_contacto_emergencia?: string;

  @Column({ type: 'float', nullable: true })
  peso_inicial: number;

  @Column({ type: 'float', nullable: true })
  altura: number;

  @Column({ type: 'float', nullable: true })
  imc: number;

  @Column({ type: 'float', nullable: true })
  peso_objetivo: number;

  @OneToMany(() => PesoM, (peso) => peso.perfilUsuario)
  pesos: PesoM[];
}
