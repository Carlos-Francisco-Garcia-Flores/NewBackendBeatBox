import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
// Middlewares
import { CorsMiddleware } from './cors.middleware';

// Módulos de la aplicación
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { SocialModule } from './social/social.module';
import { PerfilEmpresaModule } from './perfil_empresa/perfil_empresa.module';
import { DocumentoRegulatorioModule } from './documentos/documento-regulatorio.module';
import { IncidentModule } from './incident/incident.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { LogosModule } from './logos/logos.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PerfilUsuarioModule } from './perfil_usuario/perfil_usuario.module';
import { PreguntasSecretasModule } from './preguntas_secretas/preguntas_secretas.module';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';

// Entidades
import { Usuario } from './usuarios/usuarios.entity';
import { RedSocial } from './social/red-social.entity';
import { PerfilEmpresa } from './perfil_empresa/perfil_empresa.entity';
import { Logos } from './logos/logos.entity';
import { Incident } from './incident/incident.entity';
import { DocumentoRegulatorio } from './documentos/documento-regulatorio.entity';
import { Configuracion } from './configuracion/configuracion.entity';
import { Usuarios } from './auth/usuario.entity';
import { Producto } from './productos//producto.entity';
import { Categoria } from './categorias/categoria.entity';
import { Subcategoria } from './subcategorias/subcategoria.entity';
import { PreguntasSecretas } from './preguntas_secretas/preguntas-secretas.entity';
import {ImagenProducto} from './imagenes-productos/imagen-producto.entity'
import {Subscripcion} from './subscripciones/subscripciones.entity'
// Servicio de logs
import { LoggerModule } from './common/loggs/logger.module';
import { ImagenesProductosModule } from './imagenes-productos/imagenes-productos.module';
import { SubscripcionesModule } from './subscripciones/subscripciones.module';

@Module({
  imports: [
    // Carga de variables de entorno (.env)
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    // Configuración de TypeORM con PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432')), // Puerto con fallback seguro
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Usuario,
          RedSocial,
          PerfilEmpresa,
          Logos,
          Incident,
          DocumentoRegulatorio,
          Configuracion,
          Usuarios,
          Producto,
          Categoria,
          PreguntasSecretas,
          Subcategoria,
          ImagenProducto,
          Subscripcion,
        ],
        synchronize: false,
        dropSchema: false,
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    ...[
      UsuariosModule,
      AuthModule,
      SocialModule,
      PerfilEmpresaModule,
      DocumentoRegulatorioModule,
      IncidentModule,
      ConfiguracionModule,
      LogosModule,
      ProductosModule,
      CategoriasModule,
      LoggerModule,
      PerfilUsuarioModule,
    ],
    PreguntasSecretasModule,
    SubcategoriasModule,
    ImagenesProductosModule,
    SubscripcionesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
