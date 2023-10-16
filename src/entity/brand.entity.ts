import { Brand } from '@prisma/client';

export class BrandEntity implements Brand {
  id: number;
  advertiserNo: number;
  categoryId: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date | null;
}
