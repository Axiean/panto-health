import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

class DeviceDataDto {
  @IsArray()
  data: any[];

  @IsNumber()
  time: number;
}

export class XRayPayloadDto {
  [deviceId: string]: DeviceDataDto;
}
