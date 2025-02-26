import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configuracionbloqueo') // Nombre de la tabla
export class Configuracion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 5 })
  maxFailedAttempts: number;

  @Column({ default: 20 })
  lockTimeMinutes: number;
}
