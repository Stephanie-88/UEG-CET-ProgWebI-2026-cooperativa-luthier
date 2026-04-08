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
import { LuthierService } from '../services/luthier.service';
import { CreateLuthierDto, UpdateLuthierDto } from '../dto/luthier.dto';

@ApiTags('luthiers')
@Controller('luthiers')
export class LuthierController {
  constructor(private readonly luthierService: LuthierService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo luthier' })
  @ApiResponse({ status: 201, description: 'Luthier criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  create(@Body() createLuthierDto: CreateLuthierDto) {
    return this.luthierService.create(createLuthierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os luthiers' })
  @ApiResponse({ status: 200, description: 'Lista de luthiers' })
  findAll() {
    return this.luthierService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um luthier pelo ID' })
  @ApiResponse({ status: 200, description: 'Luthier encontrado' })
  @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.luthierService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um luthier' })
  @ApiResponse({ status: 200, description: 'Luthier atualizado' })
  @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLuthierDto: UpdateLuthierDto,
  ) {
    return this.luthierService.update(id, updateLuthierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um luthier' })
  @ApiResponse({ status: 200, description: 'Luthier removido' })
  @ApiResponse({ status: 404, description: 'Luthier não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.luthierService.remove(id);
  }
}
