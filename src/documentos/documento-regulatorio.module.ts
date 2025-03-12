// src/documentos-regulatorios/documento-regulatorio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoRegulatorioController } from './documento-regulatorio.controller';
import { DocumentoRegulatorioService } from './documento-regulatorio.service';
import { DocumentoRegulatorio } from './documento-regulatorio.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentoRegulatorio]), AuthModule],
  controllers: [DocumentoRegulatorioController],
  providers: [DocumentoRegulatorioService],
})
export class DocumentoRegulatorioModule {}
