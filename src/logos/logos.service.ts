import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logos } from './logos.entity';
import { CreateLogoDto } from './create-logo.dto';
import { cloudinary } from '../cloudinary/cloudinary.provider';

@Injectable()
export class LogosService {
  constructor(
    @InjectRepository(Logos)
    private readonly logoRepository: Repository<Logos>,
  ) {}

  // Crear un nuevo logo y establecerlo como vigente
  async create(createLogoDto: CreateLogoDto): Promise<Logos> {
    // Marcar como no vigente todos los logos existentes
    await this.logoRepository.update({}, { vigente: false });

    // Crear y guardar el nuevo logo como vigente
    const newLogo = this.logoRepository.create({
      ...createLogoDto,
      vigente: true, // Se marca como vigente automáticamente
    });

    return this.logoRepository.save(newLogo);
  }

  // Obtener todos los documentos de la colección
  async findAll(): Promise<Logos[]> {
    return this.logoRepository.find();
  }

  // Obtener el logo vigente
  async findVigente(): Promise<Logos> {
    const vigenteLogo = await this.logoRepository.findOne({
      where: { vigente: true },
    });

    if (!vigenteLogo) {
      throw new NotFoundException('No hay ningún logo vigente.');
    }

    return vigenteLogo;
  }

  // Establecer un logo específico como vigente
  async setVigente(id: string): Promise<Logos> {
    const logo = await this.logoRepository.findOne({ where: { id } });

    if (!logo) {
      throw new NotFoundException(`Logo con ID ${id} no encontrado.`);
    }

    // Marcar todos como no vigentes
    await this.logoRepository.update({}, { vigente: false });

    // Establecer el logo especificado como vigente
    logo.vigente = true;
    return this.logoRepository.save(logo);
  }

  // Eliminar un logo por su ID, incluyendo su eliminación en Cloudinary
  async delete(id: string): Promise<void> {
    const logo = await this.logoRepository.findOne({ where: { id } });

    if (!logo) {
      throw new NotFoundException(`Logo con ID ${id} no encontrado.`);
    }

    // Extraer el publicId de la URL de Cloudinary
    const publicId = this.extractPublicIdFromUrl(logo.link);

    if (publicId) {
      try {
        // Intentar eliminar la imagen de Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
          console.warn(`No se pudo eliminar la imagen de Cloudinary con publicId: ${publicId}`);
        }
      } catch (error) {
        console.error(`Error al eliminar la imagen de Cloudinary: ${error.message}`);
      }
    }

    // Eliminar el logo de la base de datos
    await this.logoRepository.delete(id);
  }

  // Método para extraer el publicId de una URL de Cloudinary
  private extractPublicIdFromUrl(url: string): string | null {
    const regex = /\/([^/]+)\.[a-zA-Z]+$/; // Coincide con el nombre del archivo antes de la extensión
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
