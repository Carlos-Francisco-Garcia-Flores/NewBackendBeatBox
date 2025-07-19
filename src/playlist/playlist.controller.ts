import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  // Obtener todas las playlists
  @Get('all')
  getAll(): Promise<Playlist[]> {
    return this.playlistService.findAll();
  }

  // Obtener playlist por ID
  @Get('id/:id')
  getOne(@Param('id') id: string): Promise<Playlist> {
    return this.playlistService.findOne(id);
  }

  // Crear nueva playlist
  @Post('create')
  create(@Body() data: Partial<Playlist>): Promise<Playlist> {
    return this.playlistService.create(data);
  }

  // Actualizar playlist por ID
  @Put('update/:id')
  update(@Param('id') id: string, @Body() data: Partial<Playlist>): Promise<Playlist> {
    return this.playlistService.update(id, data);
  }

  // Eliminar playlist por ID
  @Delete('delete/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.playlistService.remove(id);
  }

  // Obtener playlists por tipo
  @Get('type/:tipo')
  getByTipo(@Param('tipo') tipo: string): Promise<Playlist[]> {
    return this.playlistService.findByTipo(tipo);
  }

  // Obtener playlists vigentes
  @Get('active')
  getVigentes(): Promise<Playlist[]> {
    return this.playlistService.findVigentes();
  }

  // Desactivar todas las playlists de un tipo
  @Patch('deactivate/type/:tipo')
  async desactivarTipo(@Param('tipo') tipo: string) {
    return this.playlistService.desactivarTipo(tipo);
  }

  // Cambiar estado vigente de una playlist
  @Patch('toggle-active/id/:id')
  async cambiarVigente(@Param('id') id: string, @Body() body: { vigente: boolean }) {
    return this.playlistService.cambiarVigente(id, body.vigente);
  }
}

