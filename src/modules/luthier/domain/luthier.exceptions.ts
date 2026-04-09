import { BadRequestException, NotFoundException } from '@nestjs/common';

export class LuthierNotFoundException extends NotFoundException {
    constructor(id: number) {
        super(`Luthier com id ${id} não encontrado`);
        this.name = 'LuthierNotFoundException';
        Object.setPrototypeOf(this, LuthierNotFoundException.prototype);
    }
}

export class CamposObrigatoriosLuthierException extends BadRequestException {
    constructor(campo: string) {
        super(`O campo '${campo}' é obrigatório`);
        this.name = 'CamposObrigatoriosLuthierException';
        Object.setPrototypeOf(this, CamposObrigatoriosLuthierException.prototype);
    }
}

export class DataAberturaFuturaException extends BadRequestException {
    constructor() {
        super('A dataAbertura da oficina não pode ser uma data futura');
        this.name = 'DataAberturaFuturaException';
        Object.setPrototypeOf(this, DataAberturaFuturaException.prototype);
    }
}

export class BancadasInsuficientesException extends BadRequestException {
    constructor() {
        super('O bancadasNum deve ser maior ou igual a 2 (mínimo para uma cooperativa)');
        this.name = 'BancadasInsuficientesException';
        Object.setPrototypeOf(this, BancadasInsuficientesException.prototype);
    }
}
