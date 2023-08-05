import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
class history {
  status: string;
  updateAt: Date;
  updatedBy: updatedBy;
}
class updatedBy {
  status: string;
  updateAt: Date;
}
export class CreateResumeDto {
  email: string;
  userId: mongoose.Schema.Types.ObjectId;
  url: string;
  status: string; // PENDING-REVIEWING-APPROVED-REJECTED
  companyId: mongoose.Schema.Types.ObjectId;
  jobId: mongoose.Schema.Types.ObjectId;
  @IsArray()
  @ValidateNested({ each: true })
  history: history[];
}
export class CreateUserCvDto {
  @IsNotEmpty({ message: 'link CV không được để trống' })
  url: string;
  @IsNotEmpty({ message: 'Id công ty không được để trống' })
  @IsMongoId({ message: 'Id công ty không đúng' })
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'Id việc không được để trống' })
  @IsMongoId({ message: 'Id công ty không đúng định dạng' })
  jobId: mongoose.Schema.Types.ObjectId;
}
