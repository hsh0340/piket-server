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

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleType.ADVERTISER)
@Controller('brands')
@UseInterceptors(ResponseSerializationInterceptor)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  // 브랜드 목록 API
  @Get()
  getAllBrands() {
    return this.brandService.getAllBrands();
  }

  // 신규 브랜드 등록 API
  @Post()
  async createBrand(
    @User() advertiser: UserEntity,
    @Body() createBrandRequestDto: CreateBrandRequestDto,
  ): Promise<string> {
    await this.brandService.createBrand(advertiser, createBrandRequestDto);

    return '브랜드가 생성되었습니다.';
  }

  // 브랜드 수정 API
  @Patch(':brandId')
  updateBrand(
    @Param('brandId', new ParseIntPipe()) brandId: number,
    @Body() updateBrandRequestDto: UpdateBrandRequestDto,
  ) {
    return this.brandService.updateBrand(brandId, updateBrandRequestDto);
  }

  // 브랜드 삭제 API
  @Delete(':brandId')
  deleteBrand(@Param('brandId', new ParseIntPipe()) brandId: number) {
    return this.brandService.deleteBrand(brandId);
  }
}
