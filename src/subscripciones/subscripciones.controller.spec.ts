import { Test, TestingModule } from '@nestjs/testing';
import { SubscripcionesController } from './subscripciones.controller';

describe('SubscripcionesController', () => {
  let controller: SubscripcionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscripcionesController],
    }).compile();

    controller = module.get<SubscripcionesController>(SubscripcionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
