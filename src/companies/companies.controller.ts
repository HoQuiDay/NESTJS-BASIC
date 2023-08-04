import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customer';
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Company Successfully!')
  findAll(
    // @Query('page') page: string,
    // @Query('limit') limit: string,
    @Query() query: string,
  ) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch Company Successfully!')
  handleFindOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
    @Param('id') id: string,
  ) {
    return this.companiesService.update(updateCompanyDto, user, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
