import { Test, TestingModule } from '@nestjs/testing';
import { SubscripcionesService } from './subscripciones.service';

describe('SubscripcionesService', () => {
  let service: SubscripcionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscripcionesService],
    }).compile();

    service = module.get<SubscripcionesService>(SubscripcionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
