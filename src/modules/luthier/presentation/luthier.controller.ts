import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LuthierService } from '../application/luthier.service';
import { CreateLuthierDto, UpdateLuthierDto } from './dto/luthier.dto';

@ApiTags('Luthiers')
@Controller('luthiers')
export class LuthierController {
    constructor(private readonly luthierService: LuthierService) {}

    @Post()
    @ApiOperation({ summary: 'Cria um novo luthier' })
    @ApiResponse({ status: 201, description: 'Luthier criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou regra de negócio violada' })
    create(@Body() dto: CreateLuthierDto) {
        return this.luthierService.create(
            dto.nomeMestre,
            dto.dataAbertura,
            dto.certificada,
            dto.bancadasNum,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os luthiers' })
    @ApiResponse({ status: 200, description: 'Lista de luthiers' })
    findAll() {
        return this.luthierService.findAll();
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Busca luthier por id' })
    @ApiResponse({ status: 200, description: 'Luthier encontrado' })
    @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.luthierService.findById(id);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Atualiza dados de um luthier' })
    @ApiResponse({ status: 200, description: 'Luthier atualizado' })
    @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLuthierDto) {
        return this.luthierService.update(
            id,
            dto.nomeMestre,
            dto.dataAbertura,
            dto.certificada,
            dto.bancadasNum,
        );
    }

    @Delete(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Remove um luthier' })
    @ApiResponse({ status: 200, description: 'Luthier removido' })
    @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.luthierService.delete(id);
    }
}
