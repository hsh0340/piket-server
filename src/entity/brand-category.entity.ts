import { BrandCategory } from '@prisma/client';

export class BrandCategoryEntity implements BrandCategory {
  createdAt: Date;
  id: number;
  name: string;
  updatedAt: Date;
}
