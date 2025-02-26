import { 
  Controller, Get, Post, Body, Param, Patch, UseGuards, Delete 
} from '@nestjs/common';
import { LogosService } from './logos.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateLogoDto } from './create-logo.dto';

@Controller('logos')
export class LogosController {
  constructor(private readonly logosService: LogosService) {}

  // Crear un nuevo logo
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createLogoDto: CreateLogoDto) {
    return this.logosService.create(createLogoDto);
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
    await this.logosService.delete(id);
    return { message: `Logo con ID ${id} eliminado correctamente.` };
  }
}
