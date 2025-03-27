import { Module } from '@nestjs/common';
import { PreguntasSecretasService } from './preguntas_secretas.service';
import { PreguntasSecretasController } from './preguntas_secretas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntasSecretas } from './preguntas-secretas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreguntasSecretas])], // 👈 Asegura que la entidad está importada
  providers: [PreguntasSecretasService],
  controllers: [PreguntasSecretasController],
  exports: [PreguntasSecretasService],
  
})
export class PreguntasSecretasModule {}
