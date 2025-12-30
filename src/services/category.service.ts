import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StandardResopnse } from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { DeleteResult } from 'typeorm';

import {
  CategoryDto,
  CategoryFilterDto,
  UpdateCategoryDto,
} from 'src/dtos/category.dto';
import { CategoryRepository } from 'src/repositories/category.repository';
import { Category } from 'src/entities/category.entity';
import { CommodityFilterDto } from 'src/dtos/commodity.dto';
import { CommodityUnit } from 'src/entities/commodityUnit.entity';
import { CommodityRepository } from 'src/repositories/commodity.repository';
import { Commodity } from 'src/entities/commodity.entity';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository, private commodityRepository: CommodityRepository) {}

  async createCategory(
    categoryDto: CategoryDto,
  ): Promise<StandardResopnse<CategoryDto>> {
    const existingCategory = await this.categoryRepository.findOne({
      name: categoryDto.name,
    });

    if (existingCategory) {
      throw new UnprocessableEntityException('Name Already Exists');
    }

    await this.categoryRepository.create(categoryDto);

    return {
      data: categoryDto,
      code: 200,
      message: 'Success',
    };
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<StandardResopnse<UpdateCategoryDto>> {
    const existingCategory = await this.categoryRepository.findOne({
      name: updateCategoryDto.name,
    });

    if (existingCategory) {
      throw new UnprocessableEntityException('Name Already Exists');
    }

    await this.categoryRepository.update(id, updateCategoryDto);

    return {
      data: updateCategoryDto,
      code: 200,
      message: 'Success',
    };
  }

  async deleteCategory(id: string): Promise<StandardResopnse<DeleteResult>> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundException('Category Not found');
    }

    await this.categoryRepository.delete(id);

    return {
      data: null,
      code: 200,
      message: 'Success',
    };
  }

  async findCategories(
    paginationDto: PaginationDto,
    categoryFilterDto: CategoryFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<Category>>> {
    const result = await this.categoryRepository.findAllCategories(
      paginationDto,
      categoryFilterDto,
    );

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }

  async findCommodity(
    paginationDto: PaginationDto,
    commodityUnitFilterDto: CommodityFilterDto,
    commodityId: string,
  ): Promise<StandardResopnse<PaginatedRecordsDto<Commodity>>> {
    const result = (await this.commodityRepository.findAllCommodities(
      paginationDto,
      commodityUnitFilterDto,
      commodityId,
    )) as PaginatedRecordsDto<Commodity>

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }
}
