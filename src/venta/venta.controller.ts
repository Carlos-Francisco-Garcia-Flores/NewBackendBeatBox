import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VentasService } from './venta.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Usuario } from '../usuarios/usuarios.entity';

interface RequestWithUser extends Request {
  user: Usuario;
}

@Controller('ventas')
@UseGuards(AuthGuard('jwt'))
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post('procesar')
  async procesar(@Req() req: RequestWithUser) {
    return this.ventasService.procesarPagoYGuardarVenta(req.user);
  }

  @Get()
  async listar() {
    return this.ventasService.listarVentas();
  }

  @Get(':id')
  async obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.ventasService.obtenerVenta(id);
  }
}
