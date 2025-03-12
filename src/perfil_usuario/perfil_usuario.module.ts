import { Module } from '@nestjs/common';
import { PerfilUsuarioService } from './perfil_usuario.service';
import { PerfilUsuarioController } from './perfil_usuario.controller';

@Module({
  providers: [PerfilUsuarioService],
  controllers: [PerfilUsuarioController],
})
export class PerfilUsuarioModule {}
