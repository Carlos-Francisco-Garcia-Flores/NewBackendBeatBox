import { Test, TestingModule } from '@nestjs/testing';
import { PesoMController } from './peso-m.controller';

describe('PesoMController', () => {
  let controller: PesoMController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesoMController],
    }).compile();

    controller = module.get<PesoMController>(PesoMController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
