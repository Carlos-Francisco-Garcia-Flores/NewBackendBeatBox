import { Controller, Get, Put, Body,UseGuards, Param } from '@nestjs/common';
import { PerfilEmpresaService } from './perfil_empresa.service';
import { PerfilEmpresa } from './schemas/perfil_empresa.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';


@Controller('perfil-empresa')
export class PerfilEmpresaController {
  constructor(private readonly perfilEmpresaService: PerfilEmpresaService) {}
  
  @Get()
  async obtenerPerfil(): Promise<PerfilEmpresa> {
    return this.perfilEmpresaService.obtenerPerfil();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':campo')
  async actualizarCampo
    (
      @Param('campo') campo: string,
      @Body('valor') valor: string,
    ): Promise<PerfilEmpresa> {
    return this.perfilEmpresaService.actualizarCampo(campo, valor);
  }
}
