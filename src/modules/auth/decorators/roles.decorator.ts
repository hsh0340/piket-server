import { SetMetadata } from '@nestjs/common';
import { Role } from '@src/modules/auth/types/role-type';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
