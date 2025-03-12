import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('redesSociales') // Esta es la tabla de la base de datos
export class RedSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tipo: string;

  @Column()
  linkRed: string;
}
