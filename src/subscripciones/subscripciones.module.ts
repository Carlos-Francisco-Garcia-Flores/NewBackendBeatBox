import { Module } from '@nestjs/common';
import { SubscripcionesService } from './subscripciones.service';
import { SubscripcionesController } from './subscripciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar TypeOrmModule
import {Subscripcion} from './subscripciones.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Subscripcion])],
  providers: [SubscripcionesService],
  controllers: [SubscripcionesController]
})
export class SubscripcionesModule {}


