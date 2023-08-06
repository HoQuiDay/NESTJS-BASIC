import { Role } from './../roles/schemas/role.schema';
import { RegisterUserDto } from './../users/dto/create-user.dto';
import {
  Post,
  UseGuards,
  Controller,
  Body,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customer';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService,
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async handleLogin(@Req() req, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(req.user, res);
  }
  @Public()
  @ResponseMessage('Register a new user')
  @Post('register')
  async handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }
  @ResponseMessage('Get user information')
  @Get('account')
  async handleGetAccount(@User() user: IUser) {
    const userPermissions = (await this.rolesService.findOne(
      user.role._id,
    )) as any;
    user.permissions = userPermissions.permissions;
    return { user };
  }
  @Public()
  @ResponseMessage('Get User by refresh token')
  @Get('refresh')
  handleRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.createNewToken(req, res);
  }
  @ResponseMessage('Logout User')
  @Post('logout')
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(user, res);
  }
}
