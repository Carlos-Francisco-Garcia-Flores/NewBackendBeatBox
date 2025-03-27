import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logos } from './logos.entity';
import { cloudinary } from '../cloudinary/cloudinary.provider';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class LogosService {
  constructor(
    @InjectRepository(Logos)
    private readonly logoRepository: Repository<Logos>,
  ) {}

  // Crear un nuevo logo y subirlo a Cloudinary
  // Crear un nuevo logo desde una URL
async create(link: string): Promise<Logos> {
  if (!link) {
    throw new BadRequestException('Se requiere una URL de imagen.');
  }

  // Marcar como no vigente todos los logos anteriores
  await this.logoRepository.update({}, { vigente: false });

  // Guardar el nuevo logo
  const newLogo = this.logoRepository.create({
    link,
    vigente: true,
  });

  return this.logoRepository.save(newLogo);
}


  async uploadToCloudinary(fileBuffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(fileBuffer);
    });
  }
  // Obtener todos los logos
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
    const logo = await this.logoRepository.findOne({ where: { id: Number(id) } });

    if (!logo) {
      throw new NotFoundException(`Logo con ID ${id} no encontrado.`);
    }

    // Marcar todos los logos como no vigentes
    await this.logoRepository.update({}, { vigente: false });

    // Establecer el logo especificado como vigente
    logo.vigente = true;
    return this.logoRepository.save(logo);
  }

  // Eliminar un logo por su ID, incluyendo su eliminación en Cloudinary
  async delete(id: number): Promise<void> {
  const logo = await this.logoRepository.findOne({ where: { id } });

  if (!logo) {
    throw new NotFoundException(`Logo con ID ${id} no encontrado.`);
  }

  // Extraer el publicId de la URL de Cloudinary
  const publicId = this.extractPublicIdFromUrl(logo.link);

  if (publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        console.warn(`No se pudo eliminar la imagen de Cloudinary con publicId: ${publicId}`);
      }
    } catch (error) {
      console.error(`Error al eliminar la imagen de Cloudinary: ${error.message}`);
    }
  }

  await this.logoRepository.delete(id);
}


  // Método para extraer el publicId de una URL de Cloudinary
  private extractPublicIdFromUrl(url: string): string | null {
    const regex = /\/([^/]+)\.[a-zA-Z]+$/; // Coincide con el nombre del archivo antes de la extensión
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
