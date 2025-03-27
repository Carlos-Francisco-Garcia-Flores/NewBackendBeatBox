import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Usuarios } from '../auth/usuario.entity';

@Entity('preguntas_secretas') // Nombre de la tabla
export class PreguntasSecretas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  pregunta: string;

  // Relación 1:N con usuarios
  @OneToMany(() => Usuarios, (usuario) => usuario.preguntaSecreta)
  usuarios: Usuarios[];
}
