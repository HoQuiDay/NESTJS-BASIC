import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private RoleModel: SoftDeleteModel<RoleDocument>,
    private configService: ConfigService,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const checkName = await this.RoleModel.findOne({ name });
    if (checkName) {
      throw new BadRequestException('Đã tồn tại Role trong hệ thống');
    }
    const result = await this.RoleModel.create({
      name,
      description,
      isActive,
      permissions,
      createdBy: { _id: user._id, email: user.email },
    });
    return { _id: result._id, createAt: result.createdAt };
  }

  async findAll(query: string) {
    let { filter, sort, population, projection } = aqp(query);
    const current = filter.current;
    const pageSize = filter.pageSize;
    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;
    delete filter.current;
    delete filter.pageSize;
    const totalResult = (await this.RoleModel.find(filter)).length;
    const totalPage = Math.ceil(totalResult / defaultLimit);
    const result = await this.RoleModel.find(filter)
      .limit(defaultLimit)
      .skip(offset)
      .sort(sort as any)
      .select(projection)
      .populate(population)
      .exec();
    return {
      meta: {
        current,
        pageSize,
        pages: totalPage,
        total: totalResult,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found role');
    }
    return await this.RoleModel.findById(id).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = updateRoleDto;
    // const checkName = await this.RoleModel.findOne({ name });
    // if (checkName) {
    //   throw new BadRequestException('Đã tồn tại Role trong hệ thống');
    // }
    return await this.RoleModel.updateOne(
      { _id: id },
      {
        name,
        description,
        isActive,
        permissions,
        updateBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found Role`);
    }
    const foundRole = await this.RoleModel.findById(id);
    if ((foundRole.name = this.configService.get<string>('ROLE_ADMIN'))) {
      throw new BadRequestException(`can not Delete Admin Role`);
    }
    await this.RoleModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.RoleModel.softDelete({ _id: id });
  }
}
