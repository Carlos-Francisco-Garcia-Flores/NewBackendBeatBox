import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { AuthGuard } from '@nestjs/passport';
import { AddProductoCarritoDto } from './carrito.dto';
import { Request } from 'express';
import { Usuario } from '../usuarios/usuarios.entity'; 

interface RequestWithUser extends Request {
  user: Usuario;
}

@Controller('carrito')
@UseGuards(AuthGuard('jwt'))
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get()
  async obtener(@Req() req: RequestWithUser) {
    return this.carritoService.obtenerCarrito(req.user);
  }

  @Post('agregar')
  async agregar(
    @Req() req: RequestWithUser,
    @Body() dto: AddProductoCarritoDto,
  ) {
    return this.carritoService.agregarProducto(req.user, dto);
  }

  @Delete('eliminar/:productoId')
  async eliminar(
    @Req() req: RequestWithUser,
    @Param('productoId') productoId: string,
  ) {
    return this.carritoService.eliminarProducto(req.user, productoId);
  }

  @Delete('vaciar')
  async vaciar(@Req() req: RequestWithUser) {
    return this.carritoService.vaciarCarrito(req.user);
  }
}
