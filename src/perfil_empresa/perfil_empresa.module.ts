import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilEmpresaService } from './perfil_empresa.service';
import { PerfilEmpresaController } from './perfil_empresa.controller';
import { PerfilEmpresa } from './perfil_empresa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerfilEmpresa]), // Importar entidad para TypeORM
  ],
  controllers: [PerfilEmpresaController],
  providers: [PerfilEmpresaService],
})
export class PerfilEmpresaModule {}
