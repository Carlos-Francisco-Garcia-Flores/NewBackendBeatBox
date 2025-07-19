import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilUsuarios } from './perfil_usuario.entity';
import { PerfilUsuarioService } from './perfil_usuario.service';
import { PerfilUsuarioController } from './perfil_usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilUsuarios])],
  controllers: [PerfilUsuarioController],
  providers: [PerfilUsuarioService],
  exports: [PerfilUsuarioService],
})
export class PerfilUsuarioModule {}
