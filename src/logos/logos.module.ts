import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogosService } from './logos.service';
import { LogosController } from './logos.controller';
import { Logos } from './logos.entity';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
@Module({
  imports: [TypeOrmModule.forFeature([Logos])],
  controllers: [LogosController],
  providers: [LogosService, CloudinaryProvider],
})
export class LogosModule {}
