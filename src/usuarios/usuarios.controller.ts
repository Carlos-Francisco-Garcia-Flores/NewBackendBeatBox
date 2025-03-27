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

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch('bloquear/:id')
  async toggleBloqueo(
    @Param('id') id: string,
    @Body() body: { bloquear: boolean },
  ) {
    console.log("ID recibido en el backend:", id);
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
  async remove(@Param('id') id: number) {
    return this.usuariosService.delete(id);
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


