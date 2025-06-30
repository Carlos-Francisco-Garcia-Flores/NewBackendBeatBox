import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Req,
} from '@nestjs/common';

import { UsuariosService } from './usuarios.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { LoggService } from '../common/loggs/logger.service';
import { Request } from 'express';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly logger: LoggService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch('bloquear/:id')
  async toggleBloqueo(
    @Param('id') id: string,
    @Body() body: { bloquear: boolean },
    @Req() req: Request, // Capturar la solicitud para obtener la IP
  ) {
    console.log('ID recibido en el backend:', id);
    this.logger.log(
      `Se ha  ${body.bloquear ? 'bloqueado' : 'desbloqueado'} al usuario con ID: ${id}`,
      req,
    );
    return this.usuariosService.toggleBloqueo(id, body.bloquear);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin') // Solo accesible para administradores
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  // Buscar usuario por nombre de usuario
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('verusuario/:usuario')
  async findByUser(@Param('usuario') usuario: string) {
    const user = await this.usuariosService.findByUser(usuario);
    if (!user) {
      throw new NotFoundException(
        `Usuario con el nombre '${usuario}' no encontrado`,
      );
    }
    return user;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin') // Solo accesible para administradores
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request) {
    // Registrar log de la acción de eliminación con la IP y el ID del usuario
    this.logger.log(`Se ha elimidado el usuario con ID: ${id}`, req);

    // Proceder con la eliminación del usuario
    const result = await this.usuariosService.delete(id);

    // Retornar el resultado de la operación
    return result;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protección con JWT y Roles
  @Roles('admin') // Solo admins pueden cambiar roles
  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body() body: { newRole: string },
    @Req() req: Request,
  ) {
    return this.usuariosService.updateRole(id, body.newRole, req);
  }
}
