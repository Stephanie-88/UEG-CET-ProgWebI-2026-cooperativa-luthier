import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LuthierOrmEntity } from '../../modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity';
import { InstrumentoReparoOrmEntity } from '../../modules/instrumento-reparo/infrastructure/persistence/typeorm/instrumento-reparo.orm-entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'data/app.db',
            entities: [LuthierOrmEntity, InstrumentoReparoOrmEntity],
            synchronize: true,
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
