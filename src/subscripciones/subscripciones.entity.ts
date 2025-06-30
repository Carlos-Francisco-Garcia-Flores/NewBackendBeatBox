import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('subscripciones')
export class Subscripcion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  estado: boolean;

  @Column({ type: 'int', nullable: true })
  tiempo_activa: number; // En días (puedes cambiarlo a otro formato si lo deseas)

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' }) 
  usuario: Usuario;
  @Column()
  codigo: string;
}
