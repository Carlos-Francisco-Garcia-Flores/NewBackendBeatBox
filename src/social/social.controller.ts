import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { RedSocial } from './red-social.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateRedSocialDto } from './dto/create-red-social.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('social') //ruta base
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // Ruta para crear o actualizar un registro de red social
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('agregar')
  async createOrUpdate(
    @Body() createRedSocialDto: CreateRedSocialDto,
  ): Promise<RedSocial> {
    return this.socialService.createOrUpdate(
      createRedSocialDto.tipo,
      createRedSocialDto.linkRed,
    );
  }

  // Ruta para obtener todas las redes sociales
  @Get('listar-todos')
  async findAll(): Promise<RedSocial[]> {
    return this.socialService.findAll();
  }

  // Ruta para obtener una red social específica por su tipo
  @Get('ver/:tipo')
  async findOne(@Param('tipo') tipo: string): Promise<RedSocial> {
    return this.socialService.findOne(tipo);
  }

  // Ruta para eliminar una red social específica por su tipo
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete('eliminar/:tipo')
  async remove(@Param('tipo') tipo: string): Promise<void> {
    return this.socialService.remove(tipo);
  }
}
