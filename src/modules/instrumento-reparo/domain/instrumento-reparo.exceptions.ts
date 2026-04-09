import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

export class InstrumentoReparoNotFoundException extends NotFoundException {
    constructor(id: number) {
        super(`InstrumentoReparo com id ${id} não encontrado`);
        this.name = 'InstrumentoReparoNotFoundException';
        Object.setPrototypeOf(this, InstrumentoReparoNotFoundException.prototype);
    }
}

export class CamposObrigatoriosInstrumentoException extends BadRequestException {
    constructor(campo: string) {
        super(`O campo '${campo}' é obrigatório`);
        this.name = 'CamposObrigatoriosInstrumentoException';
        Object.setPrototypeOf(this, CamposObrigatoriosInstrumentoException.prototype);
    }
}

export class DataEntradaFuturaException extends BadRequestException {
    constructor() {
        super('A dataEntrada do instrumento não pode ser uma data futura');
        this.name = 'DataEntradaFuturaException';
        Object.setPrototypeOf(this, DataEntradaFuturaException.prototype);
    }
}

export class DataEntradaAnteriorAberturaException extends BadRequestException {
    constructor() {
        super('A dataEntrada não pode ser anterior à dataAbertura da oficina do luthier');
        this.name = 'DataEntradaAnteriorAberturaException';
        Object.setPrototypeOf(this, DataEntradaAnteriorAberturaException.prototype);
    }
}

export class LuthierNaoEncontradoParaInstrumentoException extends NotFoundException {
    constructor(id: number) {
        super(`Luthier com id ${id} não encontrado para associar ao instrumento`);
        this.name = 'LuthierNaoEncontradoParaInstrumentoException';
        Object.setPrototypeOf(this, LuthierNaoEncontradoParaInstrumentoException.prototype);
    }
}

export class CustoReparoInvalidoException extends BadRequestException {
    constructor() {
        super('O custoReparo deve ser maior que 0 e menor ou igual a 50000');
        this.name = 'CustoReparoInvalidoException';
        Object.setPrototypeOf(this, CustoReparoInvalidoException.prototype);
    }
}

export class ReparoConcluidoSemCustoException extends BadRequestException {
    constructor() {
        super('Um reparo concluído (reparoConcluido = true) não pode ter custoReparo igual a 0');
        this.name = 'ReparoConcluidoSemCustoException';
        Object.setPrototypeOf(this, ReparoConcluidoSemCustoException.prototype);
    }
}

export class InstrumentoDuplicadoEmReparoException extends ConflictException {
    constructor(modeloMadeira: string, luthierId: number) {
        super(
            `Já existe um instrumento com modelo '${modeloMadeira}' em reparo (reparoConcluido = false) para o luthier ${luthierId}`,
        );
        this.name = 'InstrumentoDuplicadoEmReparoException';
        Object.setPrototypeOf(this, InstrumentoDuplicadoEmReparoException.prototype);
    }
}
