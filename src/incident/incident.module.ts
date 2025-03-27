import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './incident.entity'; // Importa tu entidad de TypeORM
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { ConfiguracionModule } from '../configuracion/configuracion.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { LoggerModule } from '../common/loggs/logger.module'; // Importar LoggerModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident]),
    ConfiguracionModule,
    forwardRef(() => UsuariosModule),
    LoggerModule,
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}
