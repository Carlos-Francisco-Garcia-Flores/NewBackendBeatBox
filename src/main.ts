import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParse from 'cookie-parser';
import xss from 'xss-clean';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParse());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.use(xss());
  app.use(helmet());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Listening on port: ${port}`);
}

bootstrap();
