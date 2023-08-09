import {
  IsBooleanString,
  IsDefined,
  IsEmail,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CompanyObject {
  @IsNotEmpty({ message: 'Id công ty không được để trống' })
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;
  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;
  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: number;
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;
  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsMongoId({ message: 'Role phai dung la Id Mongo' })
  role: string;
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyObject)
  company: CompanyObject;
}
export class RegisterUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;
  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;
  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: number;
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;
}
export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'dayhq.uit@gmail.com', description: '123456' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'Tài khoản mặc định',
  })
  readonly password: string;
}
