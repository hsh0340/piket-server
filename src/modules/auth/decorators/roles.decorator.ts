import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@src/modules/auth/types/role-type';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
