import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
class CompanyObject {
  @IsNotEmpty({ message: 'Id công ty không được để trống' })
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  name: string;
}
export class CreateJobDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'Kỹ năng không được để trống' })
  skills: string[];
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyObject)
  company: CompanyObject;
  location: string;
  salary: number;
  level: number;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
