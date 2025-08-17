import { IsArray, IsNumber } from 'class-validator';

export class DeviceDataDto {
  @IsArray()
  data: any[];

  @IsNumber()
  time: number;
}
