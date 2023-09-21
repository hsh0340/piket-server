import { UserAuthentication } from '@prisma/client';

export class UserAuthenticationEntity implements UserAuthentication {
  id: number;
  userNo: number;
  password: string | null;
  name: string;
  cellPhone: string;
  sex: number;
  tosAgree: number;
  personalInfoAgree: number;
  ageLimitAgree: number;
  mailAgree: number;
  notificationAgree: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
