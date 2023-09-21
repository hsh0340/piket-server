import { User } from '@prisma/client';

export class UserEntity implements User {
  no: number;
  email: string;
  loginType: number;
  role: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
