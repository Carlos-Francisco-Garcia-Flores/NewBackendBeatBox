import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PreguntasSecretas } from '../preguntas_secretas/preguntas-secretas.entity';

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

  @ManyToOne(
    () => PreguntasSecretas,
    (preguntaSecreta) => preguntaSecreta.usuarios,
    { eager: true },
  )
  preguntaSecreta: PreguntasSecretas;

  @Column({ default: '' })
  preguntaSrespuesta: string;

  @Column({ unique: true })
  correo_electronico: string;

  @Column({ default: false })
  estado: boolean;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  bloqueado: boolean;

  @Column({ nullable: true })
  sessionexpiredat: Date; // Nueva columna para la expiración de la sesión
}
