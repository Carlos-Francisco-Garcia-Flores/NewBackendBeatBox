import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { SubscripcionesService } from './subscripciones.service';
import { Subscripcion } from './subscripciones.entity';

@Controller('subscripciones')
export class SubscripcionesController {
  constructor(private readonly subsService: SubscripcionesService) {}

  @Post()
  crear(@Body() body: Partial<Subscripcion>) {
    return this.subsService.crear(body);
  }

  @Get()
  obtenerTodas() {
    return this.subsService.obtenerTodas();
  }

  @Get('codigo/:codigo')
  obtenerPorCodigo(@Param('codigo') codigo: string) {
    return this.subsService.obtenerPorCodigo(codigo);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.subsService.eliminar(id);
  }
}
