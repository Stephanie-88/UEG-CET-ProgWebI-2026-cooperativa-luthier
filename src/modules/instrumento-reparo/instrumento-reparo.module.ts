import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentoReparoController } from './presentation/instrumento-reparo.controller';
import { InstrumentoReparoService } from './application/instrumento-reparo.service';
import { InstrumentoReparoOrmEntity } from './infrastructure/persistence/typeorm/instrumento-reparo.orm-entity';
import { InstrumentoReparoTypeOrmRepository } from './infrastructure/persistence/typeorm/instrumento-reparo.typeorm.repository';
import { LuthierOrmEntity } from '../luthier/infrastructure/persistence/typeorm/luthier.orm-entity';
import { LuthierTypeOrmRepository } from '../luthier/infrastructure/persistence/typeorm/luthier.typeorm.repository';

@Module({
    imports: [TypeOrmModule.forFeature([InstrumentoReparoOrmEntity, LuthierOrmEntity])],
    controllers: [InstrumentoReparoController],
    providers: [
        InstrumentoReparoService,
        {
            provide: 'InstrumentoReparoRepositoryPort',
            useClass: InstrumentoReparoTypeOrmRepository,
        },
        {
            provide: 'LuthierRepositoryPort',
            useClass: LuthierTypeOrmRepository,
        },
    ],
})
export class InstrumentoReparoModule {}
