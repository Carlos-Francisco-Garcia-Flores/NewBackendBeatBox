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

  @ManyToOne(() => PerfilUsuarios, (perfil) => perfil.pesos)
  @JoinColumn({ name: 'idperfil' })
  perfilUsuario: PerfilUsuarios;
}
