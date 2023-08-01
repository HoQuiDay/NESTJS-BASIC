import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = this.getHashPassword(createUserDto.password);
    const newUser = await this.userModel.create(createUserDto);
    return newUser;
  }
  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);
    return hashPassword;
  }

  findAll() {
    const allUser = this.userModel.find({}, '-password');
    return allUser;
  }

  async findOne(id: string) {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return 'Not Found User';
    }
    const user = await this.userModel.findOne({ _id: id }, '-password');
    return user;
  }
  findUserName(userName: string) {
    return this.userModel.findOne({ email: userName });
  }
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.updateOne(
      { _id: id },
      UpdateUserDto,
    );
    return updateUser;
  }

  remove(id: string) {
    const result = this.userModel.deleteOne({ _id: id });
    return result;
  }
}
