import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customer';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  handleCreate(@Body() createResumeDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }
  @Post('by-user')
  @ResponseMessage('Get Resumes by User')
  handleFindResumeByUser(@User() user: IUser) {
    return this.resumesService.findResumeByUser(user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch all resumes with paginate')
  handleFindAll(@Query() query: string) {
    return this.resumesService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Fetch a resume by id')
  handleFindOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update status resume')
  handleUpdate(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a resume by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
