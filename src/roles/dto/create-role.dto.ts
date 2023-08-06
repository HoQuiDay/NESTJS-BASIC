import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
  isMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;
  isActive: boolean;
  @IsArray({ message: 'Perpission phải có định dạng là array' })
  @IsMongoId({ each: true, message: 'Mỗi phần tử phải là Id permission' })
  @IsNotEmpty({ message: 'Permissions không được để trống' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
