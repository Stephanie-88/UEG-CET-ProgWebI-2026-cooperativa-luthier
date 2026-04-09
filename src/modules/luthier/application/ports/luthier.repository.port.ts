import { Luthier } from '../../domain/luthier';

export interface LuthierRepositoryPort {
    create(luthier: Luthier): Promise<Luthier>;
    findById(id: number): Promise<Luthier | null>;
    findAll(): Promise<Luthier[]>;
    update(luthier: Luthier): Promise<Luthier>;
    delete(id: number): Promise<Luthier>;
    exists(id: number): Promise<boolean>;
}
