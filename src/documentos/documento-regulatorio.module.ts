import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentoRegulatorioController } from './documento-regulatorio.controller';
import { DocumentoRegulatorioService } from './documento-regulatorio.service';
import { DocumentoRegulatorioSchema } from './schemas/documento-regulatorio.schema.ts';
import { AuthModule } from '../auth/auth.module';  // Importamos AuthModule para usar JWT y autenticación

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DocumentoRegulatorio', schema: DocumentoRegulatorioSchema }
    ]),
    AuthModule,  // Importamos AuthModule para usar JwtStrategy y AuthGuard('jwt')
  ],
  controllers: [DocumentoRegulatorioController],
  providers: [DocumentoRegulatorioService],
})
export class DocumentoRegulatorioModule {}
