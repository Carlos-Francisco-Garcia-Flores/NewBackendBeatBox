import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
  import { PreguntasSecretasService } from './preguntas_secretas.service';
  import { PreguntaSecretaDto } from './preguntas-secretas.dto';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { AuthGuard } from '@nestjs/passport';
  import { Roles } from '../common/decorators/roles.decorator';

  @Controller('preguntas-secretas')
  export class PreguntasSecretasController {
    constructor(private readonly preguntasService: PreguntasSecretasService) {}
  
    // Crear una nueva pregunta secreta
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Post()
    create(@Body() dto: PreguntaSecretaDto) {
      return this.preguntasService.create(dto);
    }
  
    // Obtener todas las preguntas secretas
    @Get()
    findAll() {
      return this.preguntasService.findAll();
    }
  
    // Obtener una pregunta por ID
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.preguntasService.findOne(id);
    }
  
    // Actualizar una pregunta secreta
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: PreguntaSecretaDto) {
      return this.preguntasService.update(id, dto);
    }
  
    // Eliminar una pregunta secreta
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Delete(':id')
    delete(@Param('id') id: string) {
      return this.preguntasService.delete(id);
    }
  }
  