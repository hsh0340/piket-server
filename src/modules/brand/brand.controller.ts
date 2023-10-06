import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { BrandService } from '@src/modules/brand/brand.service';
import { CreateBrandRequestDto } from '@src/modules/brand/dto/create-brand-request.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  // 브랜드 목록 API
  @Get()
  getAllBrands() {}

  // 신규 브랜드 등록 API
  @Post()
  createBrand(createBrandReqeustDto: CreateBrandRequestDto) {}

  // 브랜드 수정 API
  @Patch()
  updateBrand() {}

  // 브랜드 삭제 API
  @Delete()
  deleteBrand() {}
}
