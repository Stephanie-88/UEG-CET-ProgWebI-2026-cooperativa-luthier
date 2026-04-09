import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateLuthierDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  nomeMestre: string;

  @ApiProperty({ example: '2020-01-15' })
  @IsDateString()
  dataAbertura: Date;

  @ApiProperty({ example: false })
  @IsBoolean()
  certificada: boolean;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(2)
  bancadasNum: number;
}

export class UpdateLuthierDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  nomeMestre?: string;

  @ApiProperty({ example: '2020-01-15' })
  @IsDateString()
  dataAbertura?: Date;

  @ApiProperty({ example: false })
  @IsBoolean()
  certificada?: boolean;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(2)
  bancadasNum?: number;
}
