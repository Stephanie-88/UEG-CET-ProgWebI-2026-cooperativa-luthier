import { InstrumentoReparo } from '../../domain/instrumento-reparo';

export interface InstrumentoReparoRepositoryPort {
    create(instrumento: InstrumentoReparo): Promise<InstrumentoReparo>;
    findById(id: number): Promise<InstrumentoReparo | null>;
    findAll(): Promise<InstrumentoReparo[]>;
    findByLuthierId(luthierId: number): Promise<InstrumentoReparo[]>;
    update(instrumento: InstrumentoReparo): Promise<InstrumentoReparo>;
    delete(id: number): Promise<InstrumentoReparo>;
    existsByModeloAndLuthierEmReparo(
        modeloMadeira: string,
        luthierId: number,
        excludeId?: number,
    ): Promise<boolean>;
}
