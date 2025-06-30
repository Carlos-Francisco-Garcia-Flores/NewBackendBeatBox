// src/configuracion/configuracion.controller.ts
import {
  Body,
  Param,
  Controller,
  Get,
  Put,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import {
  UpdateConfiguracionDto,
  CreateConfiguracionDto,
} from './create-configuracion.dto';
import { AuthGuard } from '@nestjs/passport'; // Guard para verificar que el usuario esté autenticado
import { RolesGuard } from '../common/guards/roles.guard'; // Guard para verificar los roles de usuario
import { Roles } from '../common/decorators/roles.decorator'; // Decorador para asignar roles a las rutas
import { Configuracion } from './configuracion.entity'; // Entidad Configuración

@Controller('configuracion') // Ruta base para las configuraciones
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  /**
   * Obtener configuración actual.
   * Esta ruta solo es accesible para usuarios con rol 'admin'.
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // Solo los usuarios con rol 'admin' pueden acceder
  @Get() // Método GET para obtener la configuración
  async getConfiguracion(): Promise<Configuracion> {
    // Llama al servicio para obtener la configuración
    return this.configuracionService.getConfiguracion();
  }

  /**
   * Crear una nueva configuración.
   * Solo los administradores pueden crear configuración.
   */
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin') // Solo los usuarios con rol 'admin' pueden acceder
  @Post() // Método POST para crear una nueva configuración
  async createConfiguracion(
    @Body() createConfiguracionDto: CreateConfiguracionDto, // Recibe el DTO con los datos de configuración
  ): Promise<Configuracion> {
    // Llama al servicio para crear la nueva configuración
    return this.configuracionService.createConfiguracion(
      createConfiguracionDto,
    );
  }

  /**
   * Actualizar la configuración existente.
   * Solo los administradores pueden actualizar la configuración.
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // Solo los usuarios con rol 'admin' pueden acceder
  @Put(':campo') // Aquí definimos el campo como parámetro en la ruta
  async updateConfiguracion(
    @Param('campo') campo: string, // Recibimos el campo de la ruta
    @Body() updateConfiguracionDto: UpdateConfiguracionDto, // Recibimos el DTO con los nuevos valores
  ): Promise<Configuracion> {
    // Verificamos si el campo es uno de los permitidos
    if (!['maxFailedAttempts', 'lockTimeMinutes'].includes(campo)) {
      throw new BadRequestException(`El campo ${campo} no es válido`);
    }

    // Llamamos al servicio para actualizar la configuración
    return this.configuracionService.updateConfiguracion(
      campo,
      updateConfiguracionDto,
    );
  }
}
