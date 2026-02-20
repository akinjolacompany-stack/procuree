import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StandardResopnse } from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { DeleteResult } from 'typeorm';

import {
  RequestItemDto,
  RequestItemFilterDto,
  UpdateRequestItemDto,
} from 'src/dtos/requestItem.dto';
import { RequestItem } from 'src/entities/requestItem.entity';

import { RequestItemRepository } from 'src/repositories/requestItem.repository';
import { CommodityUnitRepository } from 'src/repositories/commodityUnits.repository';

@Injectable()
export class RequestItemService {
  constructor(
    private requestItemRepository: RequestItemRepository,
    private commodityUnitRepository: CommodityUnitRepository,
  ) {}

  async createrequestItem(
    requestItemDto: RequestItemDto,
  ): Promise<StandardResopnse<RequestItemDto>> {
    let _requestItemDto = requestItemDto;

   

    
    // Convert relation ids in the DTO to relation objects so they match DeepPartial<RequestItem>
    const payload: any = {
      ...requestItemDto,
      ifPriceHigherAction: requestItemDto.ifPriceHigherAction
        ? { id: requestItemDto.ifPriceHigherAction }
        : null,
    };

    await this.requestItemRepository.create(payload);

    return {
      data: _requestItemDto,
      code: 200,
      message: 'Success',
    };
  }

  // async updateRequestItem(
  //   id: number,
  //   updateRequestItemDto: UpdateRequestItemDto,
  // ): Promise<StandardResopnse<UpdateRequestItemDto>> {
  //   const payload: any = {
  //     ...updateRequestItemDto,
  //     ifPriceHigherAction: updateRequestItemDto.ifPriceHigherAction
  //       ? { id: updateRequestItemDto.ifPriceHigherAction }
  //       : null,
  //   };

  //   await this.requestItemRepository.update(
  //     id,
  //     payload,
  //   );

  //   return {
  //     data: updateRequestItemDto,
  //     code: 200,
  //     message: 'Success',
  //   };
  // }

  async deleteRequestItem(
    id: string,
  ): Promise<StandardResopnse<DeleteResult>> {
    const existingrequestItem =
      await this.requestItemRepository.findById(id);

    if (!existingrequestItem) {
      throw new NotFoundException('requestItem Not found');
    }

    await this.requestItemRepository.delete(id);

    return {
      data: null,
      code: 200,
      message: 'Success',
    };
  }

  async findRequestItems(
    paginationDto: PaginationDto,
    requestItemFilterDto: RequestItemFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<RequestItem>>> {
    const result =
      (await this.requestItemRepository.findAllRequestItems(
        paginationDto,
        requestItemFilterDto,
      )) as PaginatedRecordsDto<RequestItem>;

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }
}
