import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('playlists')
@Unique(['tipo', 'vigente']) // Solo una playlist vigente por tipo
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  nombre: string;

  @Column({ default: '' })
  tipo: string;

  @Column({ default: true })
  vigente: boolean;

  @Column({ default: '' })
  url: string;
}
