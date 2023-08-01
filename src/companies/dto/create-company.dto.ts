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
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Ten cong ty không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Ten cong ty không được để trống' })
  description: string;
}
