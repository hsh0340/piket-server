import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from '@src/modules/brand/brand.service';
import { CreateBrandRequestDto } from '@src/modules/brand/dto/create-brand-request.dto';
import { UpdateBrandRequestDto } from '@src/modules/brand/dto/update-brand-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@src/modules/auth/guards/roles.guard';
import { Roles } from '@src/modules/auth/decorators/roles.decorator';
import { RoleType } from '@src/modules/auth/types/role-type';
import { User } from '@src/modules/auth/decorators/user.decorator';
import { ResponseSerializationInterceptor } from '@src/common/interceptors/response-serialization.interceptor';
import { UserEntity } from '@src/entity/user.entity';
import { GetAllBrandsDto } from '@src/modules/brand/dto/get-all-brands.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleType.ADVERTISER)
@Controller('brands')
@UseInterceptors(ResponseSerializationInterceptor)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // 브랜드 목록 조회 API
  @Get()
  getAllBrands(@User() advertiser: UserEntity): Promise<GetAllBrandsDto[]> {
    return this.brandService.getAllBrands(advertiser);
  }

  // 브랜드 등록 API
  @Post()
  async createBrand(
    @User() advertiser: UserEntity,
    @Body() createBrandRequestDto: CreateBrandRequestDto,
  ): Promise<{ brandId: number }> {
    const brandId = await this.brandService.createBrand(
      advertiser,
      createBrandRequestDto,
    );

    return { brandId };
  }

  // 브랜드 수정 API
  @Patch(':brandId')
  async updateBrand(
    @User() advertiser: UserEntity,
    @Param('brandId', new ParseIntPipe()) brandId: number,
    @Body() updateBrandRequestDto: UpdateBrandRequestDto,
  ): Promise<string> {
    await this.brandService.updateBrand(
      advertiser,
      brandId,
      updateBrandRequestDto,
    );

    return '브랜드가 수정되었습니다.';
  }

  // 브랜드 삭제 API
  @Delete(':brandId')
  deleteBrand(@Param('brandId', new ParseIntPipe()) brandId: number) {
    return this.brandService.deleteBrand(brandId);
  }
}
