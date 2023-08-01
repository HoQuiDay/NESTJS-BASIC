import {
  IsBooleanString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;
  age: number;
  @IsBooleanString()
  gender: number;

  company: string;

  role: string;

  refreshToken: string;

  createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  deleteBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
}
