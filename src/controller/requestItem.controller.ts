import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StandardResopnse } from 'src/common';
import { SwaggerApiEnumTags } from 'src/common/index.enum';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { RequestItemDto, RequestItemFilterDto } from 'src/dtos/requestItem.dto';
import { RequestItem } from 'src/entities/requestItem.entity';
import { RequestItemService } from 'src/services/requestItem.service';
import { DeleteResult } from 'typeorm';

@Controller('request-items')
@ApiTags(SwaggerApiEnumTags.REQUESTITEM)
@ApiBearerAuth()
export class RequestItemController {
  constructor(private readonly requestItemService: RequestItemService) {}

  @Post()
  createRequestItem(
    @Body() createRequestItem: RequestItemDto,
  ): Promise<StandardResopnse<RequestItemDto>> {
    return this.requestItemService.createrequestItem(createRequestItem);
  }

  @Delete(':id')
  deleteRequestItem(
    @Param('id') id: string,
  ): Promise<StandardResopnse<DeleteResult>> {
    return this.requestItemService.deleteRequestItem(id);
  }

  @Get()
  findRequestItems(
    @Query() paginationDto: PaginationDto,
    @Query() requestItemFilterDto: RequestItemFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<RequestItem>>> {
    return this.requestItemService.findRequestItems(
      paginationDto,
      requestItemFilterDto,
    );
  }
}
