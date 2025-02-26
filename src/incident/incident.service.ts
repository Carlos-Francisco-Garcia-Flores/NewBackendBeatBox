import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';
import { UsuariosService } from '../usuarios/usuarios.service'; // Importar el servicio
import { CloseIncidentDto, UsernameIsBlockedDto } from './dto/incident.dto';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident) private readonly incidentRepository: Repository<Incident>,
    private readonly usuariosService: UsuariosService,  // Usar el servicio en lugar del repositorio
  ) {}

  // Registrar un intento fallido
  async loginFailedAttempt(idusuario: number): Promise<Incident> {
    const usuario = await this.usuariosService.findOne(idusuario); // Usar el servicio para buscar el usuario

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idusuario} no encontrado.`);
    }

    let incident = await this.incidentRepository.findOne({ where: { usuario } });

    const now = new Date();
    const maxFailedAttempts = 5; // Puedes traerlo de la configuración
    const lockTimeMinutes = 10;

    if (!incident) {
      // Si no existe, creamos uno nuevo
      incident = this.incidentRepository.create({
        usuario,
        failedattempts: 1,
        totalfailedattempts: 1,
        lastattempts: now,
      });
    } else {
      if (incident.isblocked && now < incident.blockexpiresat) {
        throw new ForbiddenException(
          `Cuenta bloqueada. Intenta después de ${incident.blockexpiresat.toLocaleTimeString()}`,
        );
      }

      if (incident.isblocked && now >= incident.blockexpiresat) {
        // Desbloquear si el tiempo ya pasó
        incident.failedattempts = 0;
        incident.isblocked = false;
        incident.blockexpiresat = null;
      }

      // Incrementar intentos fallidos
      incident.failedattempts += 1;
      incident.totalfailedattempts += 1;
      incident.lastattempts = now;

      // Bloquear si excede el límite
      if (incident.failedattempts >= maxFailedAttempts) {
        incident.isblocked = true;
        incident.blockexpiresat = new Date(now.getTime() + lockTimeMinutes * 60 * 1000);
      }
    }

    return await this.incidentRepository.save(incident);
  }

  // Obtener todas las incidencias abiertas
  async getOpenIncident(): Promise<Incident[]> {
    return this.incidentRepository.find({ where: { state: 'open' } });
  }

  // Obtener incidente por usuario
  async getIncidentByUser(idusuario: number): Promise<Incident | null> {
  const usuario = await this.usuariosService.findOne(idusuario); // Aquí usa el nuevo método

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idusuario} no encontrado.`);
    }

    if (usuario.bloqueado) {
      throw new ForbiddenException('El usuario ha sido bloqueado por un administrador.');
    }

    return await this.incidentRepository.findOne({ where: { usuario } });
  }

  // Cerrar incidencia
  async closeIncident(closeIncidentDto: CloseIncidentDto): Promise<Incident> {
    const { idusuario } = closeIncidentDto;

    const incident = await this.incidentRepository.findOne({ where: { usuario: { id: idusuario } } });

    if (!incident) {
      throw new NotFoundException(`No se encontró un incidente para el usuario con ID ${idusuario}`);
    }

    incident.state = 'close';
    incident.failedattempts = 0;
    incident.isblocked = false;
    incident.blockexpiresat = null;

    return await this.incidentRepository.save(incident);
  }

  // Verificar si el usuario está bloqueado
  async usernameIsBlocked(usernameIsBlockedDto: UsernameIsBlockedDto): Promise<Incident | null> {
    const { idusuario } = usernameIsBlockedDto;

    const incident = await this.incidentRepository.findOne({ where: { usuario: { id: idusuario } } });

    if (!incident) {
      return null;
    }

    const now = new Date();

    if (incident.isblocked && now >= incident.blockexpiresat) {
      incident.isblocked = false;
      incident.failedattempts = 0;
      incident.blockexpiresat = null;
      await this.incidentRepository.save(incident);
    }

    return incident;
  }
}
