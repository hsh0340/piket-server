import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BrandService } from '@src/modules/brand/brand.service';
import { CreateBrandRequestDto } from '@src/modules/brand/dto/create-brand-request.dto';
import { UpdateBrandRequestDto } from '@src/modules/brand/dto/update-brand-request.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  // 브랜드 목록 API
  @Get()
  getAllBrands() {
    return this.brandService.getAllBrands();
  }

  // 신규 브랜드 등록 API
  @Post()
  createBrand(@Body() createBrandRequestDto: CreateBrandRequestDto) {
    return this.brandService.createBrand(createBrandRequestDto);
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