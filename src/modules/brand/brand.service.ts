import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { CreateBrandRequestDto } from '@src/modules/brand/dto/create-brand-request.dto';
import {
  BrandExistsException,
  BrandNotCreatedException,
  CategoryNotFoundException,
} from '@src/common/exceptions/request.exception';
import { SuccessResponse } from '@src/common/interfaces/response.interface';

@Injectable()
export class BrandService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBrands() {
    const brands = await this.prismaService.brand.findMany({});
    return brands;
  }

  async createBrand(advertiser, createBrandRequestDto: CreateBrandRequestDto) {
    const { categoryId, name, description } = createBrandRequestDto;

    try {
      await this.prismaService.brand.create({
        data: {
          advertiserNo: advertiser.no,
          categoryId,
          name,
          description,
        },
      });

      const response: SuccessResponse<string> = {
        isSuccess: true,
        code: '1000',
        message: '요청에 성공하였습니다.',
        result: '브랜드가 생성되었습니다.',
      };

      return response;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BrandExistsException();
      } else {
        throw new BrandNotCreatedException();
      }
    }
  }

  async updateBrand(brandId: number, updateBrandRequestDto) {
    const brandUpdateQuery = await this.prismaService.brand.update({
      where: {
        id: brandId,
      },
      data: updateBrandRequestDto,
    });

    return brandUpdateQuery;
  }

  async deleteBrand(brandId: number) {
    const brandDeleteQuery = await this.prismaService.brand.delete({
      where: {
        id: brandId,
      },
    });

    return brandDeleteQuery;
  }
}
