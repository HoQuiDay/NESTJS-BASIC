import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateResumeDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: string;
  //   @IsNotEmpty({ message: 'Id của resume không được để trống' })
  //   @IsMongoId({ message: 'Id resum không đúng' })
  //   _id: string;
}
