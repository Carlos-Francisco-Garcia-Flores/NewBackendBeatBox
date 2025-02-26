import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuarios {
  @PrimaryGeneratedColumn('uuid') // Genera un ID único para cada usuario
  id: string;

  @Column({ default: '' })
  sessionId: string;

  @Column({ unique: true })
  usuario: string;

  @Column({ default: '' })
  password: string;

  @Column({ unique: true })
  correo_electronico: string;

  @Column({ default: false })
  estado: boolean;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  bloqueado: boolean;
}
