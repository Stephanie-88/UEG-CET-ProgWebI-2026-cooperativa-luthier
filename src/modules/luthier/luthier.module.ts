import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LuthierController } from './presentation/luthier.controller';
import { LuthierService } from './application/luthier.service';
import { LuthierOrmEntity } from './infrastructure/persistence/typeorm/luthier.orm-entity';
import { LuthierTypeOrmRepository } from './infrastructure/persistence/typeorm/luthier.typeorm.repository';

@Module({
    imports: [TypeOrmModule.forFeature([LuthierOrmEntity])],
    controllers: [LuthierController],
    providers: [
        LuthierService,
        {
            provide: 'LuthierRepositoryPort',
            useClass: LuthierTypeOrmRepository,
        },
    ],
    exports: [LuthierService],
})
export class LuthierModule {}
