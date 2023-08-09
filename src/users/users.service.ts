import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { USER_ROLE } from 'src/databases/sample';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private configService: ConfigService,
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createUserDto: CreateUserDto, user: IUser) {
    let { name, email, password, age, gender, address, role, company } =
      createUserDto;
    const checkMail = await this.userModel.findOne({ email });
    if (checkMail)
      throw new BadRequestException(
        `Email: ${email} đã tồn tại trong hệ thống vui lòng nhập email khác`,
      );
    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return { _id: newUser._id, email: newUser.email };
  }
  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);
    return hashPassword;
  }

  async findAll(req: string) {
    let { filter, sort, population } = aqp(req);
    const current = filter.current;
    const limit = filter.pageSize;
    delete filter.current;
    delete filter.pageSize;
    const offset = (+current - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select('-password')
      .exec();
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    // if (mongoose.Types.ObjectId.isValid(id) === false) {
    //   return 'Not Found User';
    // }
    const user = await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .select({ password: 0 })
      .populate({ path: 'role', select: { _id: 1, name: 1 } });
    return user;
  }
  findUserName(userName: string) {
    return this.userModel
      .findOne({ email: userName })
      .populate({ path: 'role', select: { name: 1 } });
  }
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const { _id, name, email, age, gender, address, role, company } =
      updateUserDto;
    const result = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        name,
        email,
        age,
        gender,
        address,
        role,
        company,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found User`);
    }
    const foundUser = await this.userModel.findById(id);
    if (
      foundUser &&
      foundUser.email === this.configService.get<string>('EMAIL_ADMIN')
    ) {
      throw new BadRequestException(`can not Delete Admin User`);
    }
    await this.userModel.updateOne({ _id: id }, { deleteBy: user });
    const result = await this.userModel.softDelete({ _id: id });
    return result;
  }
  async registerUser(registerUserDto: RegisterUserDto) {
    let { name, email, password, age, gender, address } = registerUserDto;
    const checkMail = await this.userModel.findOne({ email });
    if (checkMail)
      throw new BadRequestException(
        `Email: ${email} đã tồn tại trong hệ thống vui lòng nhập email khác`,
      );
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?._id,
    });
    return newUser;
  }
  async updateRefreshToken(refreshToken: string, id: string) {
    return await this.userModel.updateOne(
      { _id: id },
      { refreshToken: refreshToken },
    );
  }
  async findUserByToken(refreshToken: string) {
    return await this.userModel
      .findOne({ refreshToken })
      .populate({ path: 'role', select: { name: 1 } });
  }
}
