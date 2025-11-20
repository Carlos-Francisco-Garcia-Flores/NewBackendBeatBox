import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PerfilUsuarios } from 'src/perfil_usuario/perfil_usuario.entity';

@Entity('pesos')
export class PesoM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  peso: number;

  @Column({ type: 'date', nullable: true })
  fecha: Date;

  // tiempo estimado en días o semanas
  @Column({ type: 'int', nullable: true })
  proyeccion: number;

  // índice de masa corporal
  @Column({ type: 'float', nullable: true })
  imc: number;

  // peso perdido en kg
  @Column({ type: 'float', nullable: true })
  peso_perdido: number;

  // indica si el registro corresponde a un resumen mensual
  @Column({ type: 'boolean', default: false })
  es_mensual: boolean;

  // relación con el perfil de usuario
  @ManyToOne(() => PerfilUsuarios, (perfil) => perfil.pesos)
  @JoinColumn({ name: 'idperfil' })
  perfilUsuario: PerfilUsuarios;

  // 👇 columna directa para facilitar consultas por ID
  @Column({ name: 'idperfil', type: 'uuid' })
  idperfil: string;
}
