import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsBoolean,
    IsNumber,
    IsInt,
    Min,
    Max,
} from 'class-validator';

export class CreateInstrumentoReparoDto {
    @ApiProperty({ example: 'Violino Stradivarius', description: 'Modelo e tipo de madeira do instrumento' })
    @IsString()
    @IsNotEmpty()
    modeloMadeira: string;

    @ApiProperty({ example: '2024-01-15', description: 'Data de entrada na oficina (não pode ser futura nem anterior à abertura da oficina)' })
    @IsDateString()
    dataEntrada: Date;

    @ApiProperty({ example: false, description: 'Indica se o reparo foi concluído' })
    @IsBoolean()
    reparoConcluido: boolean;

    @ApiProperty({ example: 1500.0, description: 'Custo total do reparo (> 0 e <= 50000)' })
    @IsNumber()
    @Min(0.01)
    @Max(50000)
    custoReparo: number;

    @ApiProperty({ example: 1, description: 'ID do luthier responsável pelo reparo' })
    @IsInt()
    luthierId: number;
}

export class UpdateInstrumentoReparoDto extends PartialType(CreateInstrumentoReparoDto) {}
