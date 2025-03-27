// src/documentos-regulatorios/documento-regulatorio.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { DocumentoRegulatorioService } from './documento-regulatorio.service';
import { CreateDocumentoDto, UpdateDocumentoDto } from './documento.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('documentos')
export class DocumentoRegulatorioController {
  constructor(private readonly documentoService: DocumentoRegulatorioService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  async getAllDocumentos() {
    return this.documentoService.getAllDocumentos();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('buscar/:id')
  async buscarDocumentoPorId(@Param('id') id: number) {
    const documento = await this.documentoService.obtenerDocumentoPorId(id);
    if (!documento) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }
    return documento;
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  @Post()
  async createDocumento(@Body() createDocumentoDto: CreateDocumentoDto) {
    return this.documentoService.createDocumento(createDocumentoDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  async updateDocumento(
    @Param('id') id: number,
    @Body() updateDocumentoDto: UpdateDocumentoDto,
  ) {
    return this.documentoService.updateDocumento(id, updateDocumentoDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteDocumento(@Param('id') id: number) {
    return this.documentoService.deleteDocumento(id);
  }
}
