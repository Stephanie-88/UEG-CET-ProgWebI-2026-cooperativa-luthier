import { Inject, Injectable } from '@nestjs/common';
import type { InstrumentoReparoRepositoryPort } from './ports/instrumento-reparo.repository.port';
import type { LuthierRepositoryPort } from '../../luthier/application/ports/luthier.repository.port';
import { InstrumentoReparo } from '../domain/instrumento-reparo';
import {
    InstrumentoReparoNotFoundException,
    CamposObrigatoriosInstrumentoException,
    DataEntradaFuturaException,
    DataEntradaAnteriorAberturaException,
    LuthierNaoEncontradoParaInstrumentoException,
    CustoReparoInvalidoException,
    ReparoConcluidoSemCustoException,
    InstrumentoDuplicadoEmReparoException,
} from '../domain/instrumento-reparo.exceptions';

@Injectable()
export class InstrumentoReparoService {
    constructor(
        @Inject('InstrumentoReparoRepositoryPort')
        private readonly instrumentoRepo: InstrumentoReparoRepositoryPort,
        @Inject('LuthierRepositoryPort')
        private readonly luthierRepo: LuthierRepositoryPort,
    ) {}

    async create(
        modeloMadeira: string,
        dataEntrada: Date,
        reparoConcluido: boolean,
        custoReparo: number,
        luthierId: number,
    ): Promise<InstrumentoReparo> {
        // Validação 1: Campos obrigatórios
        this.validarCamposObrigatorios({ modeloMadeira, dataEntrada, reparoConcluido, custoReparo, luthierId });
        // Validação 3: FK - luthier deve existir
        await this.validarLuthierExiste(luthierId);
        // Validação 2: Consistência temporal
        await this.validarDataEntrada(dataEntrada, luthierId);
        // Validação 5: custo > 0 e <= 50000
        this.validarCustoReparo(custoReparo);
        // Validação 6: reparoConcluido true não pode ter custo 0
        this.validarReparoConcluidoComCusto(reparoConcluido, custoReparo);
        // Validação 7: sem duplicidade de modelo em reparo para o mesmo luthier
        await this.validarInstrumentoDuplicado(modeloMadeira, luthierId, reparoConcluido);

        const instrumento = new InstrumentoReparo(
            null,
            modeloMadeira.trim(),
            new Date(dataEntrada),
            reparoConcluido,
            custoReparo,
            luthierId,
        );
        return this.instrumentoRepo.create(instrumento);
    }

    async findAll(): Promise<InstrumentoReparo[]> {
        return this.instrumentoRepo.findAll();
    }

    async findById(id: number): Promise<InstrumentoReparo> {
        const instrumento = await this.instrumentoRepo.findById(id);
        if (!instrumento) throw new InstrumentoReparoNotFoundException(id);
        return instrumento;
    }

    async findByLuthierId(luthierId: number): Promise<InstrumentoReparo[]> {
        const exists = await this.luthierRepo.exists(luthierId);
        if (!exists) throw new LuthierNaoEncontradoParaInstrumentoException(luthierId);
        return this.instrumentoRepo.findByLuthierId(luthierId);
    }

    async update(
        id: number,
        modeloMadeira?: string,
        dataEntrada?: Date,
        reparoConcluido?: boolean,
        custoReparo?: number,
        luthierId?: number,
    ): Promise<InstrumentoReparo> {
        const instrumento = await this.instrumentoRepo.findById(id);
        if (!instrumento) throw new InstrumentoReparoNotFoundException(id);

        const novoLuthierId = luthierId ?? instrumento.luthierId;
        const novaDataEntrada = dataEntrada ?? instrumento.dataEntrada;
        const novoReparoConcluido = reparoConcluido ?? instrumento.reparoConcluido;
        const novoCustoReparo = custoReparo ?? instrumento.custoReparo;
        const novoModeloMadeira = modeloMadeira ?? instrumento.modeloMadeira;

        if (luthierId !== undefined) await this.validarLuthierExiste(luthierId);
        if (dataEntrada !== undefined || luthierId !== undefined) {
            await this.validarDataEntrada(novaDataEntrada, novoLuthierId);
        }
        if (custoReparo !== undefined) this.validarCustoReparo(custoReparo);
        if (reparoConcluido !== undefined || custoReparo !== undefined) {
            this.validarReparoConcluidoComCusto(novoReparoConcluido, novoCustoReparo);
        }
        if (modeloMadeira !== undefined || luthierId !== undefined) {
            await this.validarInstrumentoDuplicado(novoModeloMadeira, novoLuthierId, novoReparoConcluido, id);
        }

        instrumento.modeloMadeira = novoModeloMadeira;
        instrumento.dataEntrada = new Date(novaDataEntrada);
        instrumento.reparoConcluido = novoReparoConcluido;
        instrumento.custoReparo = novoCustoReparo;
        instrumento.luthierId = novoLuthierId;

        return this.instrumentoRepo.update(instrumento);
    }

    async delete(id: number): Promise<InstrumentoReparo> {
        const instrumento = await this.instrumentoRepo.findById(id);
        if (!instrumento) throw new InstrumentoReparoNotFoundException(id);
        return this.instrumentoRepo.delete(id);
    }

    // -------------------------------------------------------------------------
    // Validações de negócio privadas
    // -------------------------------------------------------------------------

    /** Validação 1 — todos os campos obrigatórios */
    private validarCamposObrigatorios(data: {
        modeloMadeira: string;
        dataEntrada: Date;
        reparoConcluido: boolean;
        custoReparo: number;
        luthierId: number;
    }): void {
        if (!data.modeloMadeira || data.modeloMadeira.trim() === '')
            throw new CamposObrigatoriosInstrumentoException('modeloMadeira');
        if (!data.dataEntrada)
            throw new CamposObrigatoriosInstrumentoException('dataEntrada');
        if (data.reparoConcluido === undefined || data.reparoConcluido === null)
            throw new CamposObrigatoriosInstrumentoException('reparoConcluido');
        if (data.custoReparo === undefined || data.custoReparo === null)
            throw new CamposObrigatoriosInstrumentoException('custoReparo');
        if (data.luthierId === undefined || data.luthierId === null)
            throw new CamposObrigatoriosInstrumentoException('luthierId');
    }

    /** Validação 2 — consistência temporal: dataEntrada não pode ser futura nem anterior à abertura */
    private async validarDataEntrada(dataEntrada: Date, luthierId: number): Promise<void> {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const entrada = new Date(dataEntrada);
        entrada.setHours(0, 0, 0, 0);

        if (entrada > hoje) throw new DataEntradaFuturaException();

        const luthier = await this.luthierRepo.findById(luthierId);
        if (luthier) {
            const abertura = new Date(luthier.dataAbertura);
            abertura.setHours(0, 0, 0, 0);
            if (entrada < abertura) throw new DataEntradaAnteriorAberturaException();
        }
    }

    /** Validação 3 — integridade FK: luthier deve existir */
    private async validarLuthierExiste(luthierId: number): Promise<void> {
        const exists = await this.luthierRepo.exists(luthierId);
        if (!exists) throw new LuthierNaoEncontradoParaInstrumentoException(luthierId);
    }

    /** Validação 5 — custo entre 0 (exclusive) e 50000 (inclusive) */
    private validarCustoReparo(custoReparo: number): void {
        if (custoReparo <= 0 || custoReparo > 50000) throw new CustoReparoInvalidoException();
    }

    /** Validação 6 — reparo concluído não pode ter custo 0 */
    private validarReparoConcluidoComCusto(reparoConcluido: boolean, custoReparo: number): void {
        if (reparoConcluido && custoReparo === 0) throw new ReparoConcluidoSemCustoException();
    }

    /** Validação 7 — sem duplicidade de instrumento em reparo para o mesmo luthier */
    private async validarInstrumentoDuplicado(
        modeloMadeira: string,
        luthierId: number,
        reparoConcluido: boolean,
        excludeId?: number,
    ): Promise<void> {
        if (!reparoConcluido) {
            const existe = await this.instrumentoRepo.existsByModeloAndLuthierEmReparo(
                modeloMadeira,
                luthierId,
                excludeId,
            );
            if (existe) throw new InstrumentoDuplicadoEmReparoException(modeloMadeira, luthierId);
        }
    }
}
