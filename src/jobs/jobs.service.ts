import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  async create(createJobDto: CreateJobDto, user: IUser) {
    const result = await this.jobModel.create({
      ...createJobDto,
      createdBy: { _id: user._id, email: user.email },
    });
    return {
      _id: result._id,
      createdAt: result.createdAt,
    };
  }

  async findAll(query: string) {
    let { filter, sort, population } = aqp(query);
    const { current, pageSize } = filter;
    delete filter.current;
    delete filter.pageSize;
    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;
    const totalResult = (await this.jobModel.find(filter)).length;
    const totalPage = Math.ceil(totalResult / pageSize);
    const result = await this.jobModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPage,
        total: totalResult,
      },
      result,
    };
  }

  findOne(id: string) {
    return this.jobModel.findOne({ _id: id });
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    return await this.jobModel.updateOne(
      { _id: id },
      {
        ...updateJobDto,
        updateBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.jobModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.jobModel.softDelete({ _id: id });
  }
}
