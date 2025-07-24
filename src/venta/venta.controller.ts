import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
  Body,
  Patch,
} from '@nestjs/common';
import { VentasService } from './venta.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Usuario } from '../usuarios/usuarios.entity'; 
import { Venta } from './venta.entity';

interface RequestWithUser extends Request {
  user: Usuario;
}

@Controller('ventas')
@UseGuards(AuthGuard('jwt-carrito'))
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post('procesar')
  async procesar(@Req() req: RequestWithUser, @Body() body: any) {
    return this.ventasService.crearVentaConDatos(req.user, body);
  }

  @Get()
  async listar() {
    return this.ventasService.listarVentas();
  }

  @Get(':id')
  async obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.ventasService.obtenerVenta(id);
  }

  @Get('mias/historial')
  async historial(@Req() req: RequestWithUser) {
    return this.ventasService.listarVentasDeUsuario(req.user);
  }

  @Patch(':id')
  async actualizarVenta(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<Venta>,
    ) {
      return this.ventasService.actualizarVenta(id, data);
    }
}
