import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { LogosService } from './logos.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('logos')
export class LogosController {
  constructor(private readonly logosService: LogosService) {}

  // Crear un nuevo logo (subiendo archivo a Cloudinary)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() body: { link: string }) {
    if (!body.link) {
      throw new BadRequestException('Se requiere una URL de imagen.');
    }
    return this.logosService.create(body.link);
  }

  // Obtener todos los logos
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.logosService.findAll();
  }

  // Obtener el logo vigente
  @Get('vigente')
  async findVigente() {
    return this.logosService.findVigente();
  }

  // Establecer un logo específico como vigente
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/vigente')
  async setVigente(@Param('id') id: string) {
    return this.logosService.setVigente(id);
  }

  // Eliminar un logo
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException(
        'El ID proporcionado no es un número válido.',
      );
    }

    await this.logosService.delete(parsedId);

    return { message: `Logo con ID ${parsedId} eliminado correctamente.` };
  }
}
