import { Entity, Column } from 'typeorm';

@Entity('perfil_usuarios')
export class perfil_usuarios {
  @Column({ type: 'uuid' })
  id: string;

  @Column({ default: '' })
  idusuario: string;

  @Column({ default: '' })
  peso: number;

  @Column({ default: '' })
  altura: number;

  @Column({ default: '' })
  imc: string;

  @Column({ default: 'false' })
  subscripcion: boolean;

  @Column({ type: 'timestamp', nullable: true, default: '' })
  vigenciasubscripcion: Date;
}
