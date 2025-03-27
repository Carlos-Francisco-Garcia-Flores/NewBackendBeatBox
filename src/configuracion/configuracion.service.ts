// src/configuracion/configuracion.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './configuracion.entity'; // Entidad Configuración
import {
  UpdateConfiguracionDto,
  CreateConfiguracionDto,
} from './create-configuracion.dto'; // DTOs

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Configuracion)
    private configuracionRepository: Repository<Configuracion>, // Inyección del repositorio
  ) {}

  // Obtener la configuración actual
  async getConfiguracion(): Promise<Configuracion> {
    const config = await this.configuracionRepository.findOne({ where: {} }); // Corregido con 'where' para TypeORM >= v0.3.x
    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }
    return config;
  }

  // Actualizar la configuración con el DTO de actualización
  async updateConfiguracion(campo: string, updateConfiguracionDto: UpdateConfiguracionDto): Promise<Configuracion> {
    // Buscamos la configuración existente
    const config = await this.configuracionRepository.findOne({ where: {} });
    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }
  
    // Asignamos el valor del campo correspondiente
    if (campo === 'maxFailedAttempts') {
      config.maxFailedAttempts = updateConfiguracionDto.maxFailedAttempts;
    } else if (campo === 'lockTimeMinutes') {
      config.lockTimeMinutes = updateConfiguracionDto.lockTimeMinutes;
    }
  
    // Guardamos la configuración actualizada
    return this.configuracionRepository.save(config);
  }

  // Crear una nueva configuración, utilizando el DTO de creación
  async createConfiguracion(
    createConfiguracionDto: CreateConfiguracionDto,
  ): Promise<Configuracion> {
    // Comprobamos si ya existe una configuración
    const existingConfig = await this.configuracionRepository.findOne({
      where: {},
    });
    if (existingConfig) return existingConfig;

    // Usamos los valores recibidos en el DTO para crear la configuración
    const defaultConfig = this.configuracionRepository.create({
      maxFailedAttempts: createConfiguracionDto?.maxFailedAttempts ?? 5, // Si no se pasa, usa valor por defecto
      lockTimeMinutes: createConfiguracionDto?.lockTimeMinutes ?? 20, // Si no se pasa, usa valor por defecto
    });

    return this.configuracionRepository.save(defaultConfig);
  }
}
