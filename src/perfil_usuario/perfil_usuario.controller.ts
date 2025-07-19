import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PerfilUsuarioService } from './perfil_usuario.service';
import { PerfilUsuarios } from './perfil_usuario.entity';
import { CreatePerfilUsuarioDto } from './create-perfil-usuario.dto';
import { UpdatePerfilUsuarioDto } from './update-perfil-usuario.dto';

@Controller('perfil-usuarios')
export class PerfilUsuarioController {
  constructor(private readonly perfilService: PerfilUsuarioService) {}

  @Post()
  create(@Body() body: CreatePerfilUsuarioDto): Promise<PerfilUsuarios> {
    return this.perfilService.create(body);
  }

  @Get()
  findAll(): Promise<PerfilUsuarios[]> {
    return this.perfilService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PerfilUsuarios> {
    return this.perfilService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdatePerfilUsuarioDto,
  ): Promise<PerfilUsuarios> {
    return this.perfilService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.perfilService.remove(id);
  }
}
