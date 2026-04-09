import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

export class LuthierNaoEncontradoException extends NotFoundException {
  constructor(id: number) {
    super(`Luthier com ID ${id} não encontrado`);
  }
}

export class InstrumentoDuplicadoException extends ConflictException {
  constructor(modeloMadeira: string) {
    super(`Já existe um instrumento em reparo com o modelo ${modeloMadeira}`);
  }
}

export class LuthierNaoEncontradoParaInstrumentoException extends NotFoundException {
  constructor(id: number) {
    super(`Luthier com ID ${id} não encontrado para associar ao instrumento`);
  }
}
