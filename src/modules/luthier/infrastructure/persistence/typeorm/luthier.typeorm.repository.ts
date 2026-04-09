import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LuthierRepositoryPort } from '../../../application/ports/luthier.repository.port';
import { Luthier } from '../../../domain/luthier';
import { LuthierOrmEntity } from './luthier.orm-entity';

@Injectable()
export class LuthierTypeOrmRepository implements LuthierRepositoryPort {
    constructor(
        @InjectRepository(LuthierOrmEntity)
        private readonly repo: Repository<LuthierOrmEntity>,
    ) {}

    async create(luthier: Luthier): Promise<Luthier> {
        const orm = this.repo.create({
            nomeMestre: luthier.nomeMestre,
            dataAbertura: luthier.dataAbertura,
            certificada: luthier.certificada,
            bancadasNum: luthier.bancadasNum,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findById(id: number): Promise<Luthier | null> {
        const found = await this.repo.findOneBy({ id });
        return found ? this.toDomain(found) : null;
    }

    async findAll(): Promise<Luthier[]> {
        const items = await this.repo.find({ order: { id: 'DESC' } });
        return items.map(this.toDomain);
    }

    async update(luthier: Luthier): Promise<Luthier> {
        const orm = await this.repo.findOneBy({ id: luthier.id! });
        if (!orm) throw new Error('Luthier not found');

        orm.nomeMestre = luthier.nomeMestre;
        orm.dataAbertura = luthier.dataAbertura;
        orm.certificada = luthier.certificada;
        orm.bancadasNum = luthier.bancadasNum;

        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async delete(id: number): Promise<Luthier> {
        const orm = await this.repo.findOneBy({ id });
        if (!orm) throw new Error('Luthier not found');

        const domain = this.toDomain(orm);
        await this.repo.delete({ id });
        return domain;
    }

    async exists(id: number): Promise<boolean> {
        const count = await this.repo.countBy({ id });
        return count > 0;
    }

    private toDomain = (orm: LuthierOrmEntity): Luthier => {
        return new Luthier(
            orm.id,
            orm.nomeMestre,
            orm.dataAbertura,
            orm.certificada,
            orm.bancadasNum,
        );
    };
}
