import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customer';
import { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Create a new job')
  handleCreate(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch jobs with pagination')
  handleFindAll(@Query() query: string) {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch a job by id')
  handleFindOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
  @ResponseMessage('Update a job')
  @Patch(':id')
  handleUpdate(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a job')
  handleRemove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
