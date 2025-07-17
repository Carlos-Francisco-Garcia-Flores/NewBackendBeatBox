import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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
  direccion: string;

  @Column({ default: '' })
  ciudad: string;

  @Column({ default: '' })
  codigo_postal: string;

  @Column({ type: 'float', nullable: true })
  alturaI: number;

  @Column({ type: 'float', nullable: true })
  pesoI: number;

  // Relación con los pesos registrados
  @OneToMany(() => PesoM, peso => peso.perfil)
  pesos: PesoM[];
}
