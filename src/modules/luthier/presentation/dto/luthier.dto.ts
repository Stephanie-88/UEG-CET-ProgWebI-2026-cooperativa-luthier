import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsBoolean,
    IsInt,
    Min,
} from 'class-validator';

export class CreateLuthierDto {
    @ApiProperty({ example: 'João Silva', description: 'Nome completo do mestre luthier' })
    @IsString()
    @IsNotEmpty()
    nomeMestre: string;

    @ApiProperty({ example: '2020-01-15', description: 'Data de abertura da oficina (não pode ser futura)' })
    @IsDateString()
    dataAbertura: Date;

    @ApiProperty({ example: false, description: 'Indica se a oficina possui certificação profissional' })
    @IsBoolean()
    certificada: boolean;

    @ApiProperty({ example: 3, description: 'Quantidade de bancadas de trabalho (mínimo 2)' })
    @IsInt()
    @Min(2)
    bancadasNum: number;
}

export class UpdateLuthierDto extends PartialType(CreateLuthierDto) {}
