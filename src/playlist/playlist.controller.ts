import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

    @Get()
    getAll(): Promise<Playlist[]> {
        return this.playlistService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<Playlist> {
        return this.playlistService.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<Playlist>): Promise<Playlist> {
        return this.playlistService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Playlist>): Promise<Playlist> {
        return this.playlistService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.playlistService.remove(id);
    }
    
    @Get('tipo/:tipo')
    getByTipo(@Param('tipo') tipo: string): Promise<Playlist[]> {
    return this.playlistService.findByTipo(tipo);
    }

    // GET /playlists/vigentes
    @Get('vigentes')
    getVigentes(): Promise<Playlist[]> {
    return this.playlistService.findVigentes();
}
}
