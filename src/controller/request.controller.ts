import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StandardResopnse } from 'src/common';
import { SwaggerApiEnumTags } from 'src/common/index.enum';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { RequestFilterDto, RequestDto } from 'src/dtos/request.dto';
import { RequestItemFilterDto } from 'src/dtos/requestItem.dto';
import { Request } from 'src/entities/request.entity';
import { RequestItem } from 'src/entities/requestItem.entity';
import { requestService } from 'src/services/request.service';
import { DeleteResult } from 'typeorm';

@Controller('request')
@ApiTags(SwaggerApiEnumTags.REQUEST)
@ApiBearerAuth()
export class RequestController {
  constructor(private readonly requestService: requestService) {}

  @Post()
  createRequest(
    @Body() createRequest: RequestDto,
  ): Promise<StandardResopnse<RequestDto>> {
    return this.requestService.createrequest(createRequest);
  }

  @Post('create-submit')
  createAndSubmitRequest(
    @Body() createRequest: RequestDto,
  ): Promise<StandardResopnse<RequestDto>> {
    return this.requestService.createrequest(createRequest, true);
  }

  @Delete(':id')
  deleteRequest(
    @Param('id') id: string,
  ): Promise<StandardResopnse<DeleteResult>> {
    return this.requestService.deleterequest(id);
  }

  @Get()
  findRequests(
    @Query() paginationDto: PaginationDto,
    @Query() requestFilterDto: RequestFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<Request>>> {
    return this.requestService.findrequests(paginationDto, requestFilterDto);
  }

  @Get(':id/request-items')
  findRequestItems(
    @Query() paginationDto: PaginationDto,
    @Query() requestItemFilterDto: RequestItemFilterDto,
    @Param('id') requestId: string,
  ): Promise<StandardResopnse<PaginatedRecordsDto<RequestItem>>> {
    return this.requestService.findrequestItems(
      paginationDto,
      requestItemFilterDto,
      requestId,
    );
  }
}
