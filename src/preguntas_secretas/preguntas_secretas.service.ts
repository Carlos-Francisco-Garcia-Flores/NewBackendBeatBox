import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreguntasSecretas } from './preguntas-secretas.entity';
import { PreguntaSecretaDto } from './preguntas-secretas.dto';

@Injectable()
export class PreguntasSecretasService {
  constructor(
    @InjectRepository(PreguntasSecretas)
    private readonly preguntasRepo: Repository<PreguntasSecretas>,
  ) {}

  // Crear una nueva pregunta secreta
  async create(dto: PreguntaSecretaDto): Promise<PreguntasSecretas> {
    const nuevaPregunta = this.preguntasRepo.create(dto);
    return await this.preguntasRepo.save(nuevaPregunta);
  }

  // Obtener todas las preguntas secretas
  async findAll(): Promise<PreguntasSecretas[]> {
    return await this.preguntasRepo.find();
  }

  // Obtener una pregunta por ID
  async findOne(id: string): Promise<PreguntasSecretas> {
    const pregunta = await this.preguntasRepo.findOne({ where: { id } });
    if (!pregunta) {
      throw new NotFoundException('Pregunta secreta no encontrada');
    }
    return pregunta;
  }

  // Actualizar una pregunta secreta
  async update(id: string, dto: PreguntaSecretaDto): Promise<PreguntasSecretas> {
    const pregunta = await this.findOne(id);
    pregunta.pregunta = dto.pregunta;
    return await this.preguntasRepo.save(pregunta);
  }

  // Eliminar una pregunta secreta
  async delete(id: string): Promise<void> {
    const pregunta = await this.findOne(id);
    await this.preguntasRepo.remove(pregunta);
  }
}
