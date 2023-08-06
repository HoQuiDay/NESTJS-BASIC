import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const isExit = await this.permissionModel.findOne({ apiPath, method });
    if (isExit) {
      throw new BadRequestException('Đã tồn tại đường link trong hệ thống');
    }
    const result = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: { _id: user._id, email: user.email },
    });
    return { _id: result._id, createdAt: result.createdAt };
  }

  async findAll(query: string) {
    let { filter, sort, population, projection } = aqp(query);
    const current = filter.current;
    const pageSize = filter.pageSize;
    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;
    delete filter.current;
    delete filter.pageSize;
    const totalResult = (await this.permissionModel.find(filter)).length;
    const totalPage = Math.ceil(totalResult / defaultLimit);
    const result = await this.permissionModel
      .find(filter)
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
      throw new BadRequestException(
        `id: ${id} không đúng định dạng vui lòng nhập lại id`,
      );
    }
    return await this.permissionModel.findById(id);
  }
  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    const { name, apiPath, method, module } = updatePermissionDto;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `id: ${id} không đúng định dạng vui lòng nhập lại id`,
      );
    }
    return await this.permissionModel.updateOne(
      { _id: id },
      {
        name,
        apiPath,
        method,
        module,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `id: ${id} không đúng định dạng vui lòng nhập lại id`,
      );
    }
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.permissionModel.softDelete({ _id: id });
  }
}
