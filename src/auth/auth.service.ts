import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import ms from 'ms';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserName(username);
    if (!user) {
      return null;
    }
    const isValid = this.usersService.isValidPassword(pass, user.password);
    if (isValid === true) {
      return user;
    }
    return null;
  }
  async login(user: IUser, res: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateRefreshToken(refreshToken, _id);
    res.cookie(this.configService.get<string>('NAME_COOKIES'), refreshToken, {
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRIES')) * 1000, //milisecond
      httpOnly: true,
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: { _id, name, email, role },
    };
  }
  async register(registerUserDto: RegisterUserDto) {
    const registerUser = await this.usersService.registerUser(registerUserDto);
    return {
      _id: registerUser._id,
      _email: registerUser.email,
    };
  }
  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRIES')) / 1000,
    });
    return refreshToken;
  };
  createNewToken = async (req: Request, res: Response) => {
    let refreshToken =
      req.cookies[this.configService.get<string>('NAME_COOKIES')];
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token refresh user',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };
        const refreshToken = this.createRefreshToken(payload);
        await this.usersService.updateRefreshToken(
          refreshToken,
          _id.toString(),
        );
        res.clearCookie(this.configService.get<string>('NAME_COOKIES'));
        res.cookie(
          this.configService.get<string>('NAME_COOKIES'),
          refreshToken,
          {
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRIES')), //milisecond
            httpOnly: true,
          },
        );
        return {
          access_token: this.jwtService.sign(payload),
          user: { _id, name, email, role },
        };
      } else
        throw new BadRequestException(
          'Refresh token không hợp lệ vui lòng login lại.',
        );
    } catch (error) {
      throw new BadRequestException(
        'Refresh token không hợp lệ vui lòng login lại.',
      );
    }
  };
  logout = async (user: IUser, res: Response) => {
    await this.usersService.updateRefreshToken('', user._id);
    res.clearCookie(this.configService.get<string>('NAME_COOKIES'));
    return 'Ok';
  };
}
