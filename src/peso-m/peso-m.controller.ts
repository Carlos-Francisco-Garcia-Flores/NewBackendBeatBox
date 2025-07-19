import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PesoMService } from './peso-m.service';
import { PesoM } from './peso-m.entity';

@Controller('pesos')
export class PesoMController {
  constructor(private readonly pesoService: PesoMService) {}

  @Post()
  create(@Body() body: Partial<PesoM>): Promise<PesoM> {
    return this.pesoService.create(body);
  }

  @Get()
  findAll(): Promise<PesoM[]> {
    return this.pesoService.findAll();
  }

  @Get('perfil/:idperfil')
  findByPerfil(@Param('idperfil') idperfil: string): Promise<PesoM[]> {
    return this.pesoService.findByPerfil(idperfil);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.pesoService.remove(id);
  }
}
