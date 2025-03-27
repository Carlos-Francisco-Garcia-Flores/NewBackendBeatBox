import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilEmpresaService } from './perfil_empresa.service';
import { PerfilEmpresaController } from './perfil_empresa.controller';
import { PerfilEmpresa } from './perfil_empresa.entity';
import { LogosModule } from '../logos/logos.module';
import { Logos } from '../logos/logos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerfilEmpresa, Logos]), // Agregar Logos
    LogosModule, // Importar el módulo de Logos
  ],
  controllers: [PerfilEmpresaController],
  providers: [PerfilEmpresaService],
  exports: [PerfilEmpresaService],
})
export class PerfilEmpresaModule {}
