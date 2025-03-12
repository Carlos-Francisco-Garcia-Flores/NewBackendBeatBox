// src/documentos-regulatorios/documento-regulatorio.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoRegulatorio } from './documento-regulatorio.entity';
import { CreateDocumentoDto, UpdateDocumentoDto } from './dto/documento.dto';

@Injectable()
export class DocumentoRegulatorioService {
  constructor(
    @InjectRepository(DocumentoRegulatorio)
    private documentoRepository: Repository<DocumentoRegulatorio>,
  ) {}

  private incrementVersion(version: string): string {
    const [major] = version.split('.').map(Number);
    return `${major + 1}.0`; // Incrementa la versión
  }

  async createDocumento(
    createDocumentoDto: CreateDocumentoDto,
  ): Promise<DocumentoRegulatorio> {
    const { tipo } = createDocumentoDto;

    // Cambia cualquier documento vigente del mismo tipo a no vigente
    await this.documentoRepository.update(
      { tipo, vigente: true },
      { vigente: false },
    );

    // Buscar el documento más reciente del mismo tipo para obtener la última versión
    const ultimoDocumento = await this.documentoRepository
      .createQueryBuilder('documento')
      .where('documento.tipo = :tipo', { tipo })
      .orderBy('documento.version', 'DESC')
      .getOne();

    let nuevaVersion = '1.0'; // Valor por defecto si no existe ningún documento

    if (ultimoDocumento) {
      // Incrementar la versión basada en el último documento
      const [major] = ultimoDocumento.version.split('.').map(Number); // Obtener la parte `x` de `x.0`
      nuevaVersion = `${major + 1}.0`;
    }

    const nuevoDocumento = this.documentoRepository.create({
      ...createDocumentoDto,
      version: nuevaVersion,
      vigente: true,
      eliminado: false,
    });

    return this.documentoRepository.save(nuevoDocumento);
  }

  async getAllDocumentos(): Promise<DocumentoRegulatorio[]> {
    return this.documentoRepository.find();
  }

  async obtenerDocumentoPorId(id: number): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoRepository.findOne({
      where: { id }, // Buscamos usando un objeto con la clave 'id'
    });
    if (!documento) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }
    return documento;
  }

  async updateDocumento(
    id: number,
    updateDocumentoDto: UpdateDocumentoDto,
  ): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoRepository.findOne({
      where: { id },
    });
    if (!documento) {
      throw new NotFoundException(`Documento con ID: ${id} no encontrado`);
    }

    // Desactivar el documento vigente actual
    documento.vigente = false;
    await this.documentoRepository.save(documento);

    const nuevaVersion = this.incrementVersion(documento.version);

    const nuevaVersionDocumento = this.documentoRepository.create({
      ...documento,
      ...updateDocumentoDto,
      version: nuevaVersion,
      vigente: true,
    });

    return this.documentoRepository.save(nuevaVersionDocumento);
  }

  async deleteDocumento(id: number): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoRepository.findOne({
      where: { id },
    });
    if (!documento) {
      throw new NotFoundException(`Documento con ID: ${id} no encontrado`);
    }
    documento.eliminado = true;
    documento.fechaFin = new Date();

    return this.documentoRepository.save(documento);
  }
}
