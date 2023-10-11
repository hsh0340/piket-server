import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { CreateBrandRequestDto } from '@src/modules/brand/dto/create-brand-request.dto';
import {
  BrandExistsException,
  BrandNotCreatedException,
  CategoryNotFoundException,
} from '@src/common/exceptions/request.exception';
import { UserEntity } from '@src/entity/user.entity';

@Injectable()
export class BrandService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBrands() {
    const brands = await this.prismaService.brand.findMany({});
    return brands;
  }

  /**
   * 브랜드 생성 메서드
   * @param advertiser 로그인 한 광고주 정보
   * @param createBrandRequestDto 브랜드 생성 DTO
   * @return void
   * @exception 브랜드가 이미 존재할 경우 BrandExistsException 을 반환합니다.
   * @exception 브랜드가 생성되지 않았을 경우 BrandNotCreatedException 을 반환합니다.
   */
  async createBrand(
    advertiser: UserEntity,
    createBrandRequestDto: CreateBrandRequestDto,
  ): Promise<void> {
    try {
      await this.prismaService.brand.create({
        data: {
          advertiserNo: advertiser.no,
          ...createBrandRequestDto,
        },
      });
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
