import { Module } from '@nestjs/common';
import { PesoMController } from './peso-m.controller';
import { PesoMService } from './peso-m.service';

@Module({
  controllers: [PesoMController],
  providers: [PesoMService]
})
export class PesoMModule {}
