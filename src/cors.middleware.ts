import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Obtiene los orígenes permitidos desde .env o usa valores por defecto
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:5173','https://darkseagreen-narwhal-925618.hostingersite.com/',
    ];

    const origin = req.headers.origin; // Captura el origen de la solicitud

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true'); // Permitir cookies
    }

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    );

    if (req.method === 'OPTIONS') {
      return res.status(204).send(); // Responder con 204 No Content para preflight requests
    }

    next();
  }
}