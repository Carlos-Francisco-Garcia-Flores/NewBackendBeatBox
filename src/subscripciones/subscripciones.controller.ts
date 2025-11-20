import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { SubscripcionesService } from './subscripciones.service';
import { Subscripcion } from './subscripciones.entity';
import { PaypalService } from '../common/paypal/paypal.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Usuario } from '../usuarios/usuarios.entity';

interface RequestWithUser extends Request {
  user: Usuario;
}

@Controller('subscripciones')
export class SubscripcionesController {
  constructor(
    private readonly subsService: SubscripcionesService,
    private readonly paypalService: PaypalService,
  ) {}

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

  // @UseGuards(AuthGuard('jwt'))
  // @Post('pago-paypal')
  // async pagoPayPal(
  //   @Body() body: { orderID: string; tipo: 'diaria' | 'semanal' | 'mensual' },
  //   @Req() req: RequestWithUser,
  // ) {
  //   if (!req.user) {
  //     throw new UnauthorizedException('Usuario no autenticado');
  //   }

  //   const pago = await this.paypalService.verifyOrder(body.orderID);

  //   if (pago.status !== 'COMPLETED') {
  //     throw new Error('El pago no se ha completado');
  //   }

  //   const duracion = body.tipo === 'diaria' ? 1 : body.tipo === 'semanal' ? 7 : 30;

  //   const nuevaSub = await this.subsService.crear({
  //     usuario: req.user,
  //     tiempo_activa: duracion,
  //   });

  //   return {
  //     message: 'Subscripción creada correctamente',
  //     subscripcion: nuevaSub,
  //   };
  // }
}
