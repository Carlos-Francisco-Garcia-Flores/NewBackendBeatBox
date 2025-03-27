import { Test, TestingModule } from '@nestjs/testing';
import { PreguntasSecretasService } from './preguntas_secretas.service';

describe('PreguntasSecretasService', () => {
  let service: PreguntasSecretasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreguntasSecretasService],
    }).compile();

    service = module.get<PreguntasSecretasService>(PreguntasSecretasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
