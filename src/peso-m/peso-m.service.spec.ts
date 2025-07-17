import { Test, TestingModule } from '@nestjs/testing';
import { PesoMService } from './peso-m.service';

describe('PesoMService', () => {
  let service: PesoMService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PesoMService],
    }).compile();

    service = module.get<PesoMService>(PesoMService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
