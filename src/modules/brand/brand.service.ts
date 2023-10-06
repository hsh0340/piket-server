import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { CreateBrandRequestDto } from '@src/modules/brand/dto/create-brand-request.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBrands() {
    const brands = await this.prismaService.brand.findMany({});
    return brands;
  }

  async createBrand(createBrandRequestDto: CreateBrandRequestDto) {
    const { categoryId, name, description } = createBrandRequestDto;

    const brand = await this.prismaService.brand.create({
      data: {
        advertiserNo: 1, // 이부분은 나중에 유저에게 받아온 고유번호 값으로 변경
        categoryId,
        name,
        description,
      },
    });

    return brand;
  }

  updateBrand(brandId: number, updateBrandRequestDto) {
    const brandUpdateQuery = this.prismaService.brand.update({
      where: {
        id: brandId,
      },
      data: updateBrandRequestDto,
    });

    return brandUpdateQuery;
  }
}
