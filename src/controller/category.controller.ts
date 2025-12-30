import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerApiEnumTags } from '../common/index.enum';
import {
  CategoryDto,
  CategoryFilterDto,
  UpdateCategoryDto,
} from 'src/dtos/Category.dto';
import { CategoryService } from 'src/services/category.service';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { StandardResopnse } from 'src/common';
import { DeleteResult } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { CommodityFilterDto } from 'src/dtos/commodity.dto';
import { Commodity } from 'src/entities/commodity.entity';

@Controller('category')
@ApiTags(SwaggerApiEnumTags.CATEGORY)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @Post()
  createCategory(
    @Body() creatCategory: CategoryDto,
  ): Promise<StandardResopnse<CategoryDto>> {
    return this.CategoryService.createCategory(creatCategory);
  }

  @Patch(':id')
  updateCategory(
    @Body() updateCategory: UpdateCategoryDto,
    @Param('id') id: number,
  ): Promise<StandardResopnse<UpdateCategoryDto>> {
    return this.CategoryService.updateCategory(id, updateCategory);
  }

  @Delete(':id')
  deleteCategory(
    @Param('id') id: string,
  ): Promise<StandardResopnse<DeleteResult>> {
    return this.CategoryService.deleteCategory(id);
  }

  @Get()
  async findCategorys(
    @Query() paginationDto: PaginationDto,
    @Query() CategoryFilterDto: CategoryFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<Category>>> {
    return this.CategoryService.findCategories(
      paginationDto,
      CategoryFilterDto,
    );
  }

  @Get(':id/commodity')
  async findCommodity(
    @Query() paginationDto: PaginationDto,
    @Query() CommodityFilterDto: CommodityFilterDto,
    @Param('id') categoryId: string,
  ): Promise<StandardResopnse<PaginatedRecordsDto<Commodity>>> {
    return this.CategoryService.findCommodity(
      paginationDto,
      CommodityFilterDto,
      categoryId,
    );
  }
}
