import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoRegulatorioController } from './documento-regulatorio.controller';

describe('InformacionController', () => {
  let controller: DocumentoRegulatorioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentoRegulatorioController],
    }).compile();

    controller = module.get<DocumentoRegulatorioController>(
      DocumentoRegulatorioController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
