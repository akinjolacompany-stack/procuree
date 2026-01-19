import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StandardResopnse } from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { DeleteResult } from 'typeorm';

import {
  PurchasePeriodDto,
  PurchasePeriodFilterDto,
  UpdatePurchasePeriodDto,
} from 'src/dtos/purchasePeriod.dto';
import { PurchasePeriodRepository } from 'src/repositories/purchasePeriod.repository';
import { PurchasePeriod } from 'src/entities/purchasePeriod.entity';

import { PurchasePeriodItemFilterDto } from 'src/dtos/purchasePeriodItem.dto';
import { PurchasePeriodItem } from 'src/entities/purchasePeriodItem.entity';
import { PurchasePeriodItemRepository } from 'src/repositories/purchasePeriodItems.repository';
import { PurchasePeriodStatus } from 'src/common/index.enum';
import { StringDecoder } from 'string_decoder';

@Injectable()
export class PurchasePeriodService {
  constructor(
    private purchasePeriodRepository: PurchasePeriodRepository,
    private purchasePeriodItemRepository: PurchasePeriodItemRepository,
  ) {}

  async createPurchasePeriod(
    purchasePeriodDto: PurchasePeriodDto,
    publish: boolean = false,
  ): Promise<StandardResopnse<PurchasePeriodDto>> {
    const existingPurchasePeriod = await this.purchasePeriodRepository.findOne({
      name: purchasePeriodDto.name,
    });

    if (existingPurchasePeriod) {
      throw new UnprocessableEntityException('Name Already Exists');
    }

    await this.purchasePeriodItemRepository.transaction(
      async (purchaseItemTxRepo) => {
        const { marketRunCommodities, ...rest } = purchasePeriodDto;

        const purchasePeriodTxRepo =
          purchaseItemTxRepo.manager.getRepository(PurchasePeriod);

        const marketRunCommodityTxRepo =
          purchaseItemTxRepo.manager.getRepository(PurchasePeriodItem);

        const purchasePeriodData = publish
          ? {
              ...rest,
              status: PurchasePeriodStatus.PUBLISHED,
            }
          : {
              ...rest,
              status: PurchasePeriodStatus.SAVED,
              requestStartDate: new Date(),
            };

        // 1. Create & save parent
        const purchasePeriod = purchasePeriodTxRepo.create(purchasePeriodData);

        const purchasePeriodCreated =
          await purchasePeriodTxRepo.save(purchasePeriod);

        // 2. Save child array (if present)
        if (
          Array.isArray(marketRunCommodities) &&
          marketRunCommodities.length > 0
        ) {
          const commodities = marketRunCommodities.map((item) =>
            marketRunCommodityTxRepo.create({
              ...item,
              purchasePeriodId: purchasePeriodCreated.id,
            }),
          );

          await marketRunCommodityTxRepo.save(commodities);
        }

        return purchasePeriodCreated;
      },
    );

    return {
      data: purchasePeriodDto,
      code: 200,
      message: 'Success',
    };
  }

  async publishPurchasePeriod(id: String): Promise<StandardResopnse<any>> {
    const existingPurchasePeriod =
      await this.purchasePeriodRepository.findById(id);

    if (!existingPurchasePeriod) {
      throw new NotFoundException('Market Run Not Found');
    }

    if (existingPurchasePeriod.status !== PurchasePeriodStatus.SAVED) {
      throw new UnprocessableEntityException(
        'Invalide Request: Market Run has been published',
      );
    }

    await this.purchasePeriodRepository.update(id, {
      status: PurchasePeriodStatus.PUBLISHED,
    });

    return {
      data: null,
      code: 200,
      message: 'Success',
    };
  }

  async updatePurchasePeriod(
    id: number,
    updatePurchasePeriodDto: UpdatePurchasePeriodDto,
  ): Promise<StandardResopnse<UpdatePurchasePeriodDto>> {
    const existingPurchasePeriod = await this.purchasePeriodRepository.findOne({
      name: updatePurchasePeriodDto.name,
    });

    if (existingPurchasePeriod) {
      throw new UnprocessableEntityException('Name Already Exists');
    }

    if (existingPurchasePeriod.status === PurchasePeriodStatus.CLOSED) {
      throw new UnprocessableEntityException(
        'Invalid Request: Market Run has is Already Close',
      );
    }

    await this.purchasePeriodRepository.update(id, updatePurchasePeriodDto);

    return {
      data: updatePurchasePeriodDto,
      code: 200,
      message: 'Success',
    };
  }

  async deletePurchasePeriod(
    id: string,
  ): Promise<StandardResopnse<DeleteResult>> {
    const existingPurchasePeriod =
      await this.purchasePeriodRepository.findById(id);

    if (!existingPurchasePeriod) {
      throw new NotFoundException('PurchasePeriod Not found');
    }

    await this.purchasePeriodRepository.delete(id);

    return {
      data: null,
      code: 200,
      message: 'Success',
    };
  }

  async findpurchasePeriods(
    paginationDto: PaginationDto,
    PurchasePeriodFilterDto: PurchasePeriodFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<PurchasePeriod>>> {
    const result = (await this.purchasePeriodRepository.findAllpurchasePeriods(
      paginationDto,
      PurchasePeriodFilterDto,
    )) as PaginatedRecordsDto<PurchasePeriod>;

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }

  async findPurchasePeriodItems(
    paginationDto: PaginationDto,
    PurchasePeriodUnitFilterDto: PurchasePeriodItemFilterDto,
    PurchasePeriodId: string,
  ): Promise<StandardResopnse<PaginatedRecordsDto<PurchasePeriodItem>>> {
    const result =
      (await this.purchasePeriodItemRepository.findAllpurchasePeriodItems(
        paginationDto,
        PurchasePeriodUnitFilterDto,
        PurchasePeriodId,
      )) as PaginatedRecordsDto<PurchasePeriodItem>;

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }
}
