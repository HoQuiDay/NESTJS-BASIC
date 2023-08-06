import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'ApiPath không được để trống' })
  apiPath: string;
  @IsNotEmpty({ message: 'Phương thức không được để trống' })
  method: string;
  @IsNotEmpty({ message: 'Module không được để trống' })
  module: string; //thuộc modules nào ?
}
