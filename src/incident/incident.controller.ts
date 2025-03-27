import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  NotFoundException,
  ForbiddenException,
  Req,
} from '@nestjs/common';

import { IncidentService } from './incident.service';
import { CloseIncidentDto, RegisterIncidentDto } from './incident.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller()
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post('incident')
  async registerFailedAttempt(
    @Body() registerIncidentDto: RegisterIncidentDto,
    @Req() req: Request, // Inyectar req para obtener la IP
  ) {
    return this.incidentService.loginFailedAttempt(
      registerIncidentDto.idusuario,
      req, // Pasar req al servicio para registrar la IP
    );
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('incident/:usuario')
  async getIncidentByUser(@Param('usuario') usuario: string) {
    try {
      console.log(`Buscando incidencia para el usuario: ${usuario}`);

      const incident = await this.incidentService.getIncidentByUser(usuario);

      if (!incident) {
        console.log(`No se encontraron incidencias para el usuario: ${usuario}`);
        return {
          message: `No se encontraron incidencias para el usuario '${usuario}'.`,
        };
      }

      console.log(`Incidencia encontrada:`, incident);
      return incident;
    } catch (error) {
      console.error(`Error al obtener incidencias:`, error);

      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new Error(`Error al obtener incidencias: ${error.message}`);
    }
  }

  @Get('open')
  async getOpenIncident() {
    return this.incidentService.getOpenIncident();
  }

  @Post('close')
  async closeOpenIncident(@Body() closeIncidentDto: CloseIncidentDto) {
    return this.incidentService.closeIncident(closeIncidentDto);
  }
}
