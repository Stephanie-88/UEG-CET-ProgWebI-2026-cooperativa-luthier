import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InstrumentoReparoService } from '../services/instrumento-reparo.service';
import {
  CreateInstrumentoReparoDto,
  UpdateInstrumentoReparoDto,
} from '../dto/instrumento-reparo.dto';

@ApiTags('instrumentos-reparo')
@Controller('instrumentos-reparo')
export class InstrumentoReparoController {
  constructor(
    private readonly instrumentoReparoService: InstrumentoReparoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo instrumento em reparo' })
  @ApiResponse({ status: 201, description: 'Instrumento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
  @ApiResponse({ status: 409, description: 'Instrumento duplicado' })
  create(@Body() createInstrumentoReparoDto: CreateInstrumentoReparoDto) {
    return this.instrumentoReparoService.create(createInstrumentoReparoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os instrumentos em reparo' })
  @ApiResponse({ status: 200, description: 'Lista de instrumentos' })
  findAll() {
    return this.instrumentoReparoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um instrumento em reparo pelo ID' })
  @ApiResponse({ status: 200, description: 'Instrumento encontrado' })
  @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.instrumentoReparoService.findOne(id);
  }

  @Get('luthier/:luthierId')
  @ApiOperation({ summary: 'Listar instrumentos de um luthier' })
  @ApiResponse({ status: 200, description: 'Lista de instrumentos do luthier' })
  findByLuthier(@Param('luthierId', ParseIntPipe) luthierId: number) {
    return this.instrumentoReparoService.findByLuthier(luthierId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um instrumento em reparo' })
  @ApiResponse({ status: 200, description: 'Instrumento atualizado' })
  @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstrumentoReparoDto: UpdateInstrumentoReparoDto,
  ) {
    return this.instrumentoReparoService.update(id, updateInstrumentoReparoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um instrumento em reparo' })
  @ApiResponse({ status: 200, description: 'Instrumento removido' })
  @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.instrumentoReparoService.remove(id);
  }
}
