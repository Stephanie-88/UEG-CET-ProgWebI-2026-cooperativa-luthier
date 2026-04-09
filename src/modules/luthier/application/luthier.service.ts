import { Inject, Injectable } from '@nestjs/common';
import type { LuthierRepositoryPort } from './ports/luthier.repository.port';
import { Luthier } from '../domain/luthier';
import {
    LuthierNotFoundException,
    CamposObrigatoriosLuthierException,
    DataAberturaFuturaException,
    BancadasInsuficientesException,
} from '../domain/luthier.exceptions';

@Injectable()
export class LuthierService {
    constructor(
        @Inject('LuthierRepositoryPort')
        private readonly luthierRepo: LuthierRepositoryPort,
    ) {}

    async create(
        nomeMestre: string,
        dataAbertura: Date,
        certificada: boolean,
        bancadasNum: number,
    ): Promise<Luthier> {
        // Validação 1: Campos obrigatórios
        this.validarCamposObrigatorios({ nomeMestre, dataAbertura, certificada, bancadasNum });
        // Validação 2: bancadas >= 2
        this.validarBancadas(bancadasNum);
        // Validação 3: dataAbertura não pode ser futura
        this.validarDataAbertura(dataAbertura);

        const luthier = new Luthier(null, nomeMestre.trim(), new Date(dataAbertura), certificada, bancadasNum);
        return this.luthierRepo.create(luthier);
    }

    async findAll(): Promise<Luthier[]> {
        return this.luthierRepo.findAll();
    }

    async findById(id: number): Promise<Luthier> {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier) throw new LuthierNotFoundException(id);
        return luthier;
    }

    async update(
        id: number,
        nomeMestre?: string,
        dataAbertura?: Date,
        certificada?: boolean,
        bancadasNum?: number,
    ): Promise<Luthier> {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier) throw new LuthierNotFoundException(id);

        if (bancadasNum !== undefined) this.validarBancadas(bancadasNum);
        if (dataAbertura !== undefined) this.validarDataAbertura(dataAbertura);

        if (nomeMestre !== undefined) luthier.nomeMestre = nomeMestre.trim();
        if (dataAbertura !== undefined) luthier.dataAbertura = new Date(dataAbertura);
        if (certificada !== undefined) luthier.certificada = certificada;
        if (bancadasNum !== undefined) luthier.bancadasNum = bancadasNum;

        return this.luthierRepo.update(luthier);
    }

    async delete(id: number): Promise<Luthier> {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier) throw new LuthierNotFoundException(id);
        return this.luthierRepo.delete(id);
    }

    // -------------------------------------------------------------------------
    // Validações de negócio privadas
    // -------------------------------------------------------------------------

    private validarCamposObrigatorios(data: {
        nomeMestre: string;
        dataAbertura: Date;
        certificada: boolean;
        bancadasNum: number;
    }): void {
        if (!data.nomeMestre || data.nomeMestre.trim() === '')
            throw new CamposObrigatoriosLuthierException('nomeMestre');
        if (!data.dataAbertura)
            throw new CamposObrigatoriosLuthierException('dataAbertura');
        if (data.certificada === undefined || data.certificada === null)
            throw new CamposObrigatoriosLuthierException('certificada');
        if (data.bancadasNum === undefined || data.bancadasNum === null)
            throw new CamposObrigatoriosLuthierException('bancadasNum');
    }

    private validarBancadas(bancadasNum: number): void {
        if (bancadasNum < 2) throw new BancadasInsuficientesException();
    }

    private validarDataAbertura(dataAbertura: Date): void {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const data = new Date(dataAbertura);
        data.setHours(0, 0, 0, 0);
        if (data > hoje) throw new DataAberturaFuturaException();
    }
}
