import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StandardResopnse } from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { DeleteResult } from 'typeorm';

import {
  RequestDto,
  RequestFilterDto,
  UpdateRequestDto,
} from 'src/dtos/Request.dto';
import { RequestRepository } from 'src/repositories/request.repository';
import { Request } from 'src/entities/request.entity';

import { RequestItemFilterDto } from 'src/dtos/requestItem.dto';
import { RequestItem } from 'src/entities/requestItem.entity';
import { RequestItemRepository } from 'src/repositories/requestItem.repository';
import { RequestStatus, PriceVarianceAction } from 'src/common/index.enum';
import { StringDecoder } from 'string_decoder';

@Injectable()
export class requestService {
  constructor(
    private requestRepository: RequestRepository,
    private requestItemRepository: RequestItemRepository,
  ) {}

  async createrequest(
    requestDto: RequestDto,
    publish: boolean = false,
  ): Promise<StandardResopnse<RequestDto>> {
    await this.requestItemRepository.transaction(async (purchaseItemTxRepo) => {
      const { requestItems, ...rest } = requestDto;

      const requestTxRepo = purchaseItemTxRepo.manager.getRepository(Request);

      const requestItemTxRepo =
        purchaseItemTxRepo.manager.getRepository(RequestItem);

      const requestData = {
        ...rest,
        // status: requestStatus.SAVED,
        requestStartDate: new Date(),
      };

      // 1. Create & save parent
      const request = requestTxRepo.create(requestData);

      const requestCreated = await requestTxRepo.save(request);

      // 2. Save child array (if present)
      if (Array.isArray(requestItems) && requestItems.length > 0) {
        const items = requestItems.map((item) =>
          requestItemTxRepo.create({
            ...item,
            request: { id: requestCreated.id },
            ifPriceHigherAction:
              item.ifPriceHigherAction as unknown as PriceVarianceAction,
            ifPriceLowerAction:
              item.ifPriceLowerAction as unknown as PriceVarianceAction,
          }),
        );

        await requestItemTxRepo.save(items);
      }

      return requestCreated;
    });

    return {
      data: requestDto,
      code: 200,
      message: 'Success',
    };
  }

  // async updaterequest(
  //   id: number,
  //   updateRequestDto: UpdateRequestDto,
  // ): Promise<StandardResopnse<UpdateRequestDto>> {

  //   await this.requestRepository.update(id, updateRequestDto);

  //   return {
  //     data: updaterequestDto,
  //     code: 200,
  //     message: 'Success',
  //   };
  // }

  async deleterequest(id: string): Promise<StandardResopnse<DeleteResult>> {
    const existingrequest = await this.requestRepository.findById(id);

    if (!existingrequest) {
      throw new NotFoundException('request Not found');
    }

    await this.requestRepository.delete(id);

    return {
      data: null,
      code: 200,
      message: 'Success',
    };
  }

  async findrequests(
    paginationDto: PaginationDto,
    requestFilterDto: RequestFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<Request>>> {
    const result = (await this.requestRepository.findAllRequests(
      paginationDto,
      requestFilterDto,
    )) as PaginatedRecordsDto<Request>;

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }

  async findrequestItems(
    paginationDto: PaginationDto,
    requestUnitFilterDto: RequestItemFilterDto,
    requestId: string,
  ): Promise<StandardResopnse<PaginatedRecordsDto<RequestItem>>> {
    const result = (await this.requestItemRepository.findAllRequestItems(
      paginationDto,
      requestUnitFilterDto,
      requestId,
    )) as PaginatedRecordsDto<RequestItem>;

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }
}
