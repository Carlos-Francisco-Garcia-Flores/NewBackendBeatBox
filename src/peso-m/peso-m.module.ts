import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PesoM } from './peso-m.entity';
import { PesoMService } from './peso-m.service';
import { PesoMController } from './peso-m.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PesoM])],
  controllers: [PesoMController],
  providers: [PesoMService],
  exports: [PesoMService], 
})
export class PesoMModule {}
