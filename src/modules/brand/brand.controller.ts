import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { BrandService } from '@src/modules/brand/brand.service';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  // 신규 브랜드 등록 API
  @Post()
  createBrand() {}

  // 브랜드 수정 API
  @Patch()
  updateBrand() {}

  // 브랜드 목록 API
  @Get()
  getAllBrands() {}

  // 브랜드 삭제 API
  @Delete()
  deleteBrand() {}
}
