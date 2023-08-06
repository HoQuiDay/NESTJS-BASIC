import { ConfigService } from '@nestjs/config';
import { Logger, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schemas';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  private readonly logger = new Logger(DatabasesService.name);
  async onModuleInit() {
    const isInitData = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInitData)) {
      const countUser = await this.userModel.count({});
      const countPermission = await this.permissionModel.count({});
      const countRole = await this.roleModel.count({});
      if (!countPermission) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }
      if (!countRole) {
        const permission = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin thì Full quyền:v',
            isActive: true,
            permissions: permission,
          },
          {
            name: USER_ROLE,
            description: 'User thì không quyền:v',
            isActive: true,
            permissions: [],
          },
        ]);
      }
      if (!countUser) {
        const adminRole = await this.roleModel.findOne({
          name: ADMIN_ROLE,
        });
        const userRole = await this.roleModel.findOne({
          name: USER_ROLE,
        });
        await this.userModel.insertMany([
          {
            name: 'Hồ Quí Đầy',
            email: 'dayhq.uit@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('PASSWORD_ADMIN'),
            ),
            age: 19,
            gender: 'MALE',
            address: 'Viet Nam',
            role: adminRole?._id,
          },
          {
            name: 'Người dùng',
            email: 'nguoidung@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('PASSWORD_ADMIN'),
            ),
            age: 29,
            gender: 'MALE',
            address: 'Hà Nội',
            role: userRole?._id,
          },
        ]);
        if (countUser > 0 && countRole > 0 && countPermission > 0) {
          this.logger.log('>>>ALREADY INT SAMPLE DATA');
        }
      }
    }
  }
}
