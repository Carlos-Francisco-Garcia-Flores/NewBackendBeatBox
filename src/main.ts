import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParse from 'cookie-parser';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilitando cookie-parser para manejar cookies en las peticiones HTTP de manera segura
  app.use(cookieParse());

  // habilitando Validation pipe para validadr y sanitizar datos  de entrada para evitas inyecciones de SQL 
  // Y ATAQUES XSS
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Utilizando xss-clean para limpiar y sanitizar los datos de entrada para evitar ataques XSS
  app.use(xss());
  // Utilizando helmet para mejorar la seguridad de la aplicacion web HTTP
  app.use(helmet());

   // Limitación de peticiones (Previene ataques de Fuerza Bruta y DoS)
   app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máximo 100 solicitudes por IP en 15 min
      message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Listening on port: ${port}`);
}

bootstrap();
