import { BadRequestException } from '@nestjs/common';

export class CamposObrigatoriosException extends BadRequestException {
  constructor(campo: string) {
    super(`O campo ${campo} é obrigatório`);
  }
}

export class DataFuturaException extends BadRequestException {
  constructor(campo: string) {
    super(`A ${campo} não pode ser uma data futura`);
  }
}

export class DataInconsistenteException extends BadRequestException {
  constructor(mensagem: string) {
    super(mensagem);
  }
}

export class BancadasInsuficientesException extends BadRequestException {
  constructor() {
    super('O número de bancadas deve ser maior ou igual a 2');
  }
}

export class CustoReparoInvalidoException extends BadRequestException {
  constructor() {
    super('O custo do reparo deve ser maior que 0 e menor ou igual a 50000');
  }
}

export class ReparoConcluidoSemCustoException extends BadRequestException {
  constructor() {
    super('Um reparo concluído não pode ter custo zero');
  }
}
