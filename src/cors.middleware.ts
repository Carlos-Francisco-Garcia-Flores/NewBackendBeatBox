import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`🌐 CORS Request from: ${req.headers.origin || 'No origin'} to ${req.url}`);
    
    // Obtiene los orígenes permitidos desde .env o usa valores por defecto
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'https://backend-beatboxbackend.qvmevn.easypanel.host',
      'https://darkseagreen-narwhal-925618.hostingersite.com',
      'http://10.0.2.2:3000',        
      'http://localhost:3000',       
      'http://127.0.0.1:3000',      
      'http://0.0.0.0:3000'          
    ];

    const origin = req.headers.origin;

    if (!origin) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
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
      return res.status(204).send();
    }

    next();
  }
}