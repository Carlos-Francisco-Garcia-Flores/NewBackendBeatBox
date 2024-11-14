import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParse from 'cookie-parser';
import xss from 'xss-clean';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);


  app.use(cookieParse());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.use(xss()); 


  app.use(helmet());

  app.enableCors({
  origin: ['http://localhost:5173', 'https://orangered-ape-514605.hostingersite.com'], // Permite el dominio del frontend
    credentials: true
  });

  mongoose.set('sanitizeFilter', true);

  await app.listen(configService.get<number>("PORT"));
  console.log(`Listen in http://localhost:${configService.get<number>("PORT")}`,);

}

bootstrap();
