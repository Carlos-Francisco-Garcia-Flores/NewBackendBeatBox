import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';  // Importar TypeOrmModule
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { RedSocial } from './red-social.entity';  // Importar la entidad

@Module({
  imports: [
    TypeOrmModule.forFeature([RedSocial]), // Usar TypeOrmModule con la entidad
  ],
  providers: [SocialService],
  controllers: [SocialController],
})
export class SocialModule {}
