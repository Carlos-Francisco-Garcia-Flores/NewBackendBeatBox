import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoRegulatorioService } from './documento-regulatorio.service';

describe('DocumentoRegulatorioService', () => {
  let service: DocumentoRegulatorioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentoRegulatorioService],
    }).compile();

    service = module.get<DocumentoRegulatorioService>(
      DocumentoRegulatorioService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
