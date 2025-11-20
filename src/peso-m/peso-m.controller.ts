import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PesoMService } from './peso-m.service';
import { PesoM } from './peso-m.entity';

@Controller('pesos')
export class PesoMController {
  constructor(private readonly pesoService: PesoMService) {}

  // Crea un nuevo registro de peso
  @Post()
  create(@Body() body: Partial<PesoM>): Promise<PesoM> {
    return this.pesoService.create(body);
  }


  @Post('añadir')
  crearAll(@Body() body: Partial<PesoM>): Promise<PesoM> {
    return this.pesoService.create(body);
  }

  // Obtiene todos los registros de peso
  @Get()
  findAll(): Promise<PesoM[]> {
    return this.pesoService.findAll();
  }

  // Obtiene registros de peso por perfil
  @Get('perfil/:idperfil')
  findByPerfil(@Param('idperfil') idperfil: string): Promise<PesoM[]> {
    return this.pesoService.findByPerfil(idperfil);
  }

  // Elimina un registro de peso por ID
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.pesoService.remove(id);
  }

}
