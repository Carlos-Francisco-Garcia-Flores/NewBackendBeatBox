import { Module } from '@nestjs/common';
import { LoggService } from './logger.service';

@Module({
  providers: [LoggService],
  exports: [LoggService], 
})
export class LoggerModule {}
