import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;
  @IsArray({ message: 'Skill phải có định dạng là array' })
  @IsNotEmpty({ message: 'Skill không được để trống' })
  skills: string[];
}
