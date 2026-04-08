import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateInstrumentoReparoDto {
  @ApiProperty({ example: 'Violino Stradivarius' })
  @IsString()
  @IsNotEmpty()
  modeloMadeira: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  dataEntrada: Date;

  @ApiProperty({ example: false })
  @IsBoolean()
  reparoConcluido: boolean;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  custoReparo: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  luthierId: number;
}

export class UpdateInstrumentoReparoDto {
  @ApiProperty({ example: 'Violino Stradivarius' })
  @IsString()
  modeloMadeira?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  dataEntrada?: Date;

  @ApiProperty({ example: false })
  @IsBoolean()
  reparoConcluido?: boolean;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  custoReparo?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  luthierId?: number;
}
