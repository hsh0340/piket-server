import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { CreateBrandRequestDto } from '@src/modules/brand/dto/create-brand-request.dto';
import {
  BrandExistsException,
  BrandNotCreatedException,
  BrandNotUpdatedException,
  BrandsNotFoundException,
  BrandNotExistsException,
  NoBrandInfoUpdatedException,
} from '@src/common/exceptions/request.exception';
import { UserEntity } from '@src/entity/user.entity';
import { GetAllBrandsDto } from '@src/modules/brand/dto/get-all-brands.dto';
import { UpdateBrandRequestDto } from '@src/modules/brand/dto/update-brand-request.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 브랜드 목록 조회 메서드
   * @param advertiser 로그인 한 광고주 정보
   * @return 조회 한 모든 브랜드의 객체가 담긴 배열을 반환합니다.
   * @exception 브랜드 목록 조회에 실패한 경우 BrandsNotFoundException 을 반환합니다.
   */
  async getAllBrands(advertiser: UserEntity): Promise<GetAllBrandsDto[]> {
    try {
      return await this.prismaService.brand.findMany({
        select: {
          id: true,
          categoryId: true,
          name: true,
          description: true,
        },
        where: {
          advertiserNo: advertiser.no,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (err) {
      throw new BrandsNotFoundException();
    }
  }

  /**
   * 브랜드 등록 메서드
   * @param advertiser 로그인 한 광고주 정보
   * @param createBrandRequestDto 브랜드 등록 DTO
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

  /**
   * 브랜드 수정 메서드
   * @param advertiser 로그인 한 광고주 정보
   * @param brandId 수정하려는 브랜드의 고유 번호
   * @param updateBrandRequestDto 브랜드 수정 DTO
   * @return void
   * @exception 수정 후 브랜드 정보가 이미 존재하는 브랜드와 일치할 경우 BrandExistsException 을 반환합니다.
   * @exception 수정하려는 브랜드가 존재하지 않을 경우 BrandNotExistsException 을 반환합니다.
   * @exception 업데이트 된 브랜드의 정보가 없을 경우 NoBrandInfoUpdatedException 을 반환합니다.
   * @exception 브랜드 업데이트에 실패한 경우 BrandNotUpdatedException 을 반환합니다.
   */
  async updateBrand(
    advertiser: UserEntity,
    brandId: number,
    updateBrandRequestDto: UpdateBrandRequestDto,
  ): Promise<void> {
    /*
     * update 하려는 브랜드가 로그인 한 광고주의 브랜드인지 확인하고, 아니라면 예외를 던집니다.
     */
    const savedBrand = await this.prismaService.brand.findUnique({
      where: {
        advertiserNo: advertiser.no,
        id: brandId,
      },
    });

    if (!savedBrand) {
      throw new BrandNotExistsException();
    }

    /*
     * 수정된 데이터가 존재하는지 확인하고, 존재하지 않는다면 예외를 던집니다.
     */
    const { categoryId, name, description } = updateBrandRequestDto;

    if (
      savedBrand.categoryId === categoryId &&
      savedBrand.name === name &&
      savedBrand.description === description
    ) {
      throw new NoBrandInfoUpdatedException();
    }

    try {
      await this.prismaService.brand.update({
        where: {
          id: brandId,
        },
        data: updateBrandRequestDto,
      });

      return;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BrandExistsException();
      } else {
        console.log(err);
        throw new BrandNotUpdatedException();
      }
    }
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
