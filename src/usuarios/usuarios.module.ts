import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar TypeOrmModule
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './usuarios.entity'; // Importar la entidad
import { LoggerModule } from '../common/loggs/logger.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    LoggerModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
