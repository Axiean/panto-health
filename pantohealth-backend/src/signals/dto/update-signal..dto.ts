import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSignalDto {
  @ApiPropertyOptional({
    description: 'The unique identifier of the IoT device.',
    example: '66bb584d4ae73e488c30a072',
  })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'The length of the data array in the signal.',
    example: 15,
  })
  @IsNumber()
  @IsOptional()
  dataLength?: number;
}
