import {
  IsBooleanString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateCompanyDto {
  email: string;
  @IsNotEmpty({ message: 'Ten cong ty không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'Địa chỉ công ty không được để trống' })
  address: string;
  @IsNotEmpty({ message: 'Mô tả cong ty không được để trống' })
  description: string;
  @IsNotEmpty({ message: 'Logo công ty không được để trống' })
  logo: string;
}
