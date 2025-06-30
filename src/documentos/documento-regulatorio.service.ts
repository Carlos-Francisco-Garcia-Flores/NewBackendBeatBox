import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoRegulatorio } from './documento-regulatorio.entity';
import { CreateDocumentoDto, UpdateDocumentoDto } from './documento.dto';

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

  // Crear un nuevo documento y mantener el historial de versiones
  async createDocumento(
    createDocumentoDto: CreateDocumentoDto,
  ): Promise<DocumentoRegulatorio> {
    const { tipo } = createDocumentoDto;

    // Cambiar cualquier documento vigente del mismo tipo a no vigente
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

  // Obtener todos los documentos
  async getAllDocumentos(): Promise<DocumentoRegulatorio[]> {
    return this.documentoRepository.find();
  }

  // Obtener documento por ID
  async obtenerDocumentoPorId(id: number): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoRepository.findOne({
      where: { id }, // Buscamos usando un objeto con la clave 'id'
    });
    if (!documento) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }
    return documento;
  }

  // Actualizar un documento (mantener historial de versiones)
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

    // Desactivar el documento vigente actual (lo marca como no vigente)
    documento.vigente = false;
    // Asegurarse de no incluir datos no deseados como el 'id' ni otros campos que deberían mantenerse constantes.
    const { id: documentoId, fechainicio, ...documentoData } = documento;

    // Guardamos el documento desactivado
    await this.documentoRepository.save(documento);

    // Incrementar la versión y crear el nuevo documento
    const nuevaVersion = this.incrementVersion(documento.version);

    // Crear un nuevo documento con los datos actualizados y la nueva versión
    const nuevaVersionDocumento = this.documentoRepository.create({
      ...documentoData, // Solo los datos que no se deben modificar
      ...updateDocumentoDto, // Los datos actualizados
      version: nuevaVersion, // Nueva versión incrementada
      vigente: true, // Hacer que la nueva versión sea vigente
      fechainicio: new Date(), // Fecha de creación para el nuevo documento
    });

    // Guardar el nuevo documento
    return this.documentoRepository.save(nuevaVersionDocumento);
  }

  // Eliminar un documento (marcar como eliminado)
  async deleteDocumento(id: number): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoRepository.findOne({
      where: { id },
    });
    if (!documento) {
      throw new NotFoundException(`Documento con ID: ${id} no encontrado`);
    }
    documento.eliminado = true;
    documento.fechafin = new Date();

    return this.documentoRepository.save(documento);
  }
}
