import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Subscriber, SubscriberDocument } from './schemas/subscribers.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { email, name, skills } = createSubscriberDto;
    const checkEmail = await this.subscriberModel.findOne({ email });
    if (checkEmail) {
      throw new BadRequestException('Email đã đăng ký Subscriber');
    }
    const result = await this.subscriberModel.create({
      email,
      name,
      skills,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: result._id,
      createAt: result.createdAt,
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
    const totalResult = (await this.subscriberModel.find(filter)).length;
    const totalPage = Math.ceil(totalResult / defaultLimit);
    const result = await this.subscriberModel
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
      throw new BadRequestException('not found role');
    }
    return await this.subscriberModel.findById(id);
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    // const checkEmail = await this.subscriberModel.findOne({ email });
    // if (checkEmail) {
    //   throw new BadRequestException('Email đã tồn tại trong hệ thống');
    // }
    return await this.subscriberModel.updateOne(
      { email: user.email },
      {
        ...updateSubscriberDto,
        updateBy: { _id: user._id, email: user.email },
      },
      { upsert: true },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found Role`);
    }
    await this.subscriberModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.subscriberModel.softDelete({ _id: id });
  }
  async getSkills(user: IUser) {
    return await this.subscriberModel.findOne(
      { email: user.email },
      { skills: 1 },
    );
  }
}
