import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`🌐 CORS Request from: ${req.headers.origin || 'No origin'} to ${req.url}`);
    
    // Obtiene los orígenes permitidos desde .env o usa valores por defecto
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'https://darkseagreen-narwhal-925618.hostingersite.com',
      'http://10.0.2.2:3000',        // ✅ Para emulador Android
      'http://localhost:3000',       // ✅ Para desarrollo local
      'http://127.0.0.1:3000',       // ✅ Alternativa localhost
      'http://0.0.0.0:3000'          // ✅ Para todas las interfaces
    ];

    const origin = req.headers.origin;

    // ✅ Permitir requests sin origin (como los de aplicaciones móviles)
    if (!origin) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      console.log('✅ CORS: Allowing request without origin');
    } else if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      console.log(`✅ CORS: Allowing origin ${origin}`);
    } else {
      console.log(`❌ CORS: Blocking origin ${origin}`);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization, X-CSRF-TOKEN',
    );

    if (req.method === 'OPTIONS') {
      console.log('🔄 CORS: Handling preflight request');
      return res.status(204).send();
    }

    next();
  }
}