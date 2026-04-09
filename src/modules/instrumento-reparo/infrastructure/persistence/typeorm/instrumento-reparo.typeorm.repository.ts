import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstrumentoReparoRepositoryPort } from '../../../application/ports/instrumento-reparo.repository.port';
import { InstrumentoReparo } from '../../../domain/instrumento-reparo';
import { InstrumentoReparoOrmEntity } from './instrumento-reparo.orm-entity';

@Injectable()
export class InstrumentoReparoTypeOrmRepository implements InstrumentoReparoRepositoryPort {
    constructor(
        @InjectRepository(InstrumentoReparoOrmEntity)
        private readonly repo: Repository<InstrumentoReparoOrmEntity>,
    ) {}

    async create(instrumento: InstrumentoReparo): Promise<InstrumentoReparo> {
        const orm = this.repo.create({
            modeloMadeira: instrumento.modeloMadeira,
            dataEntrada: instrumento.dataEntrada,
            reparoConcluido: instrumento.reparoConcluido,
            custoReparo: instrumento.custoReparo,
            luthierId: instrumento.luthierId,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findById(id: number): Promise<InstrumentoReparo | null> {
        const found = await this.repo.findOneBy({ id });
        return found ? this.toDomain(found) : null;
    }

    async findAll(): Promise<InstrumentoReparo[]> {
        const items = await this.repo.find({ order: { id: 'DESC' } });
        return items.map(this.toDomain);
    }

    async findByLuthierId(luthierId: number): Promise<InstrumentoReparo[]> {
        const items = await this.repo.find({
            where: { luthierId },
            order: { id: 'DESC' },
        });
        return items.map(this.toDomain);
    }

    async update(instrumento: InstrumentoReparo): Promise<InstrumentoReparo> {
        const orm = await this.repo.findOneBy({ id: instrumento.id! });
        if (!orm) throw new Error('InstrumentoReparo not found');

        orm.modeloMadeira = instrumento.modeloMadeira;
        orm.dataEntrada = instrumento.dataEntrada;
        orm.reparoConcluido = instrumento.reparoConcluido;
        orm.custoReparo = instrumento.custoReparo;
        orm.luthierId = instrumento.luthierId;

        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async delete(id: number): Promise<InstrumentoReparo> {
        const orm = await this.repo.findOneBy({ id });
        if (!orm) throw new Error('InstrumentoReparo not found');

        const domain = this.toDomain(orm);
        await this.repo.delete({ id });
        return domain;
    }

    async existsByModeloAndLuthierEmReparo(
        modeloMadeira: string,
        luthierId: number,
        excludeId?: number,
    ): Promise<boolean> {
        const qb = this.repo
            .createQueryBuilder('ir')
            .where('ir.modeloMadeira = :modeloMadeira', { modeloMadeira })
            .andWhere('ir.luthierId = :luthierId', { luthierId })
            .andWhere('ir.reparoConcluido = :reparoConcluido', { reparoConcluido: false });

        if (excludeId !== undefined) {
            qb.andWhere('ir.id != :excludeId', { excludeId });
        }

        const count = await qb.getCount();
        return count > 0;
    }

    private toDomain = (orm: InstrumentoReparoOrmEntity): InstrumentoReparo => {
        return new InstrumentoReparo(
            orm.id,
            orm.modeloMadeira,
            orm.dataEntrada,
            orm.reparoConcluido,
            orm.custoReparo,
            orm.luthierId,
        );
    };
}
