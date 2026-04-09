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
import { InstrumentoReparoService } from '../application/instrumento-reparo.service';
import { CreateInstrumentoReparoDto, UpdateInstrumentoReparoDto } from './dto/instrumento-reparo.dto';

@ApiTags('Instrumentos Reparo')
@Controller('instrumentos-reparo')
export class InstrumentoReparoController {
    constructor(private readonly instrumentoReparoService: InstrumentoReparoService) {}

    @Post()
    @ApiOperation({ summary: 'Cria um novo instrumento em reparo' })
    @ApiResponse({ status: 201, description: 'Instrumento criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou regra de negócio violada' })
    @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
    @ApiResponse({ status: 409, description: 'Instrumento duplicado em reparo para o mesmo luthier' })
    create(@Body() dto: CreateInstrumentoReparoDto) {
        return this.instrumentoReparoService.create(
            dto.modeloMadeira,
            dto.dataEntrada,
            dto.reparoConcluido,
            dto.custoReparo,
            dto.luthierId,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os instrumentos em reparo' })
    @ApiResponse({ status: 200, description: 'Lista de instrumentos' })
    findAll() {
        return this.instrumentoReparoService.findAll();
    }

    @Get('luthier/:luthierId')
    @ApiParam({ name: 'luthierId', example: 1 })
    @ApiOperation({ summary: 'Lista instrumentos de um luthier específico' })
    @ApiResponse({ status: 200, description: 'Lista de instrumentos do luthier' })
    @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
    findByLuthierId(@Param('luthierId', ParseIntPipe) luthierId: number) {
        return this.instrumentoReparoService.findByLuthierId(luthierId);
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Busca instrumento por id' })
    @ApiResponse({ status: 200, description: 'Instrumento encontrado' })
    @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.instrumentoReparoService.findById(id);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Atualiza dados de um instrumento em reparo' })
    @ApiResponse({ status: 200, description: 'Instrumento atualizado' })
    @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInstrumentoReparoDto) {
        return this.instrumentoReparoService.update(
            id,
            dto.modeloMadeira,
            dto.dataEntrada,
            dto.reparoConcluido,
            dto.custoReparo,
            dto.luthierId,
        );
    }

    @Delete(':id')
    @ApiParam({ name: 'id', example: 1 })
    @ApiOperation({ summary: 'Remove um instrumento em reparo' })
    @ApiResponse({ status: 200, description: 'Instrumento removido' })
    @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.instrumentoReparoService.delete(id);
    }
}
