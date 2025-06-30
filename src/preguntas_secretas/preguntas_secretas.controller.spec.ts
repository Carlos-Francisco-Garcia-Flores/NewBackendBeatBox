import { Test, TestingModule } from '@nestjs/testing';
import { PreguntasSecretasController } from './preguntas_secretas.controller';

describe('PreguntasSecretasController', () => {
  let controller: PreguntasSecretasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreguntasSecretasController],
    }).compile();

    controller = module.get<PreguntasSecretasController>(
      PreguntasSecretasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
