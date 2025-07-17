import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepo: Repository<Playlist>,
    ) {}

    async findAll(): Promise<Playlist[]> {
        return this.playlistRepo.find();
    }

    async findOne(id: string): Promise<Playlist> {
        return this.playlistRepo.findOneBy({ id });
    }

    async create(data: Partial<Playlist>): Promise<Playlist> {
    if (!data.tipo) {
        throw new BadRequestException('El campo "tipo" es obligatorio');
    }

    // Desactiva la playlist vigente actual del mismo tipo
    await this.playlistRepo.update({ tipo: data.tipo, vigente: true }, { vigente: false });

    // Crear la nueva playlist como vigente
    const nueva = this.playlistRepo.create({
        ...data,
        vigente: true,
    });

    return this.playlistRepo.save(nueva);
    }
        // Obtener playlists por tipo
    async findByTipo(tipo: string): Promise<Playlist[]> {
    return this.playlistRepo.find({ where: { tipo } });
    }

        // Obtener todas las playlists vigentes
    async findVigentes(): Promise<Playlist[]> {
    return this.playlistRepo.find({ where: { vigente: true } });
    }

    async update(id: string, data: Partial<Playlist>): Promise<Playlist> {
        const playlist = await this.playlistRepo.findOneBy({ id });
        if (!playlist) throw new BadRequestException('Playlist no encontrada');

        // Si se quiere marcar vigente, actualizar las otras primero
        if (data.vigente && data.tipo) {
        await this.playlistRepo.update({ tipo: data.tipo }, { vigente: false });
        }

        Object.assign(playlist, data);
        return this.playlistRepo.save(playlist);
    }

    async remove(id: string): Promise<void> {
        await this.playlistRepo.delete(id);
    }
    }
