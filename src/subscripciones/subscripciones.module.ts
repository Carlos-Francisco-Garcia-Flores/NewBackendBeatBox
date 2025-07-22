import { Module } from '@nestjs/common';
import { SubscripcionesService } from './subscripciones.service';
import { SubscripcionesController } from './subscripciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar TypeOrmModule
import {Subscripcion} from './subscripciones.entity'
import { PaypalService } from '../common/paypal/paypal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscripcion])],
  providers: [SubscripcionesService, PaypalService],
  controllers: [SubscripcionesController]
})
export class SubscripcionesModule {}
