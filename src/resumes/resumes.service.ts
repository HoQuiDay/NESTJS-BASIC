import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {
    const date = new Date();
    console.log(date);
  }
  async create(createResumeDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createResumeDto;
    const newResume = await this.resumeModel.create({
      url,
      companyId,
      jobId,
      email: user.email,
      userId: user._id,
      status: 'PENDING',
      history: {
        status: 'PENDING',
        updateAt: new Date(),
        updateBy: {
          _id: user._id,
          email: user.email,
        },
      },
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newResume._id,
      _createdAt: newResume.createdAt,
    };
  }

  async findAll(query: string) {
    let { filter, sort, population, projection } = aqp(query);
    const current = filter.current;
    const pageSize = filter.pageSize;
    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;
    delete filter.current;
    delete filter.pageSize;
    const totalResult = (await this.resumeModel.find(filter)).length;
    const totalPage = Math.ceil(totalResult / defaultLimit);
    const result = await this.resumeModel
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
    return await this.resumeModel.findOne({ _id: id });
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    return await this.resumeModel.updateOne(
      { _id: id },
      {
        status: updateResumeDto.status,
        updateBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status: updateResumeDto.status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `id: ${id} không đúng định dạng vui lòng nhập lại id`,
      );
    }
    await this.resumeModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.resumeModel.softDelete({ _id: id });
  }
  async findResumeByUser(user: IUser) {
    return await this.resumeModel.find({ userId: user._id });
  }
}
