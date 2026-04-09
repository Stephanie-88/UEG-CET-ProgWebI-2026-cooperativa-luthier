import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { LuthierOrmEntity } from '../../modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity';
import { InstrumentoReparoOrmEntity } from '../../modules/instrumento-reparo/infrastructure/persistence/typeorm/instrumento-reparo.orm-entity';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'data/app.db',
    entities: [LuthierOrmEntity, InstrumentoReparoOrmEntity],
    synchronize: true,
});
