import { Controller, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
import { PerfilEmpresaService } from './perfil_empresa.service';
import { PerfilEmpresa } from './perfil_empresa.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdatePerfilEmpresaDto } from './update-perfil_empresa.dto';

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
  async actualizarCampo(
    @Param('campo') campo: string,
    @Body() updatePerfilEmpresaDto: UpdatePerfilEmpresaDto,
  ) {
    // Asegúrate de que idlogo es un número
    if (campo === 'idlogo' && updatePerfilEmpresaDto.idlogo) {
      updatePerfilEmpresaDto.idlogo = Number(updatePerfilEmpresaDto.idlogo);
    }
    return this.perfilEmpresaService.actualizarCampo(
      campo,
      updatePerfilEmpresaDto,
    );
  }
}
