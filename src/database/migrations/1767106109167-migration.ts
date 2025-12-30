import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767106109167 implements MigrationInterface {
    name = 'Migration1767106109167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."purchase_periods_status_enum" AS ENUM('DRAFT', 'OPEN', 'CLOSED', 'FINALIZED')`);
        await queryRunner.query(`CREATE TABLE "purchase_periods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "groupId" uuid NOT NULL, "name" character varying(120) NOT NULL, "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."purchase_periods_status_enum" NOT NULL DEFAULT 'DRAFT', "attachDeadline" TIMESTAMP WITH TIME ZONE, "allocationsLocked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_82fa4aa875429471725527e71e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4e5122a7a6575033fe9d208a3c" ON "purchase_periods" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3991d107ea28cd503dba998237" ON "purchase_periods" ("groupId", "status") `);
        await queryRunner.query(`CREATE TYPE "public"."purchase_period_items_status_enum" AS ENUM('ACTIVE', 'HIDDEN', 'DISABLED')`);
        await queryRunner.query(`CREATE TABLE "purchase_period_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "groupId" uuid NOT NULL, "purchasePeriodId" uuid NOT NULL, "commodityId" uuid NOT NULL, "commodityUnitId" uuid NOT NULL, "pricePerUnit" numeric(12,2) NOT NULL, "status" "public"."purchase_period_items_status_enum" NOT NULL DEFAULT 'ACTIVE', "displayLabel" character varying(255), "isVisibleToProcurees" boolean NOT NULL DEFAULT true, CONSTRAINT "uq_period_commodity_unit" UNIQUE ("groupId", "purchasePeriodId", "commodityId", "commodityUnitId"), CONSTRAINT "PK_ca377f39bd959b3af5cfdc83484" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_38e916795b1eb5e21b4789df65" ON "purchase_period_items" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3019a9b53d2ed2173496599a23" ON "purchase_period_items" ("purchasePeriodId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9685a6ae98783bd00a35bd75b1" ON "purchase_period_items" ("commodityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2ae76396cb34c1d96fd983c80a" ON "purchase_period_items" ("commodityUnitId") `);
        await queryRunner.query(`CREATE TYPE "public"."request_items_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'AWAITING_CONSENT', 'CONFIRMED', 'CANCELLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'UNFULFILLED')`);
        await queryRunner.query(`CREATE TABLE "request_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "groupId" uuid NOT NULL, "purchasePeriodId" uuid NOT NULL, "userId" uuid NOT NULL, "purchasePeriodItemId" uuid NOT NULL, "requestedQty" numeric(10,2) NOT NULL, "pricePerUnitAtRequest" numeric(12,2) NOT NULL, "lineEstimatedTotal" numeric(14,2) NOT NULL, "status" "public"."request_items_status_enum" NOT NULL DEFAULT 'DRAFT', CONSTRAINT "PK_400276415bc0e472f04b55f1b1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83cfa03629d7982f99ef2103b1" ON "request_items" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b029e1307e472c6870a00d9306" ON "request_items" ("purchasePeriodId") `);
        await queryRunner.query(`CREATE INDEX "IDX_da159f2f16b388e7611eba8c04" ON "request_items" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_821c62a4cc28af591395ed7200" ON "request_items" ("purchasePeriodItemId") `);
        await queryRunner.query(`ALTER TABLE "commodity_units" ADD "conversionFactor" numeric(10,4) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "commodity_units" ADD "baseUnitId" uuid`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ADD CONSTRAINT "FK_4e5122a7a6575033fe9d208a3c2" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commodity_units" ADD CONSTRAINT "FK_1e1216710932b90e31662305ecc" FOREIGN KEY ("baseUnitId") REFERENCES "commodity_units"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" ADD CONSTRAINT "FK_3019a9b53d2ed2173496599a23a" FOREIGN KEY ("purchasePeriodId") REFERENCES "purchase_periods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" ADD CONSTRAINT "FK_9685a6ae98783bd00a35bd75b13" FOREIGN KEY ("commodityId") REFERENCES "commodities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" ADD CONSTRAINT "FK_2ae76396cb34c1d96fd983c80ac" FOREIGN KEY ("commodityUnitId") REFERENCES "commodity_units"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD CONSTRAINT "FK_83cfa03629d7982f99ef2103b1c" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD CONSTRAINT "FK_b029e1307e472c6870a00d93067" FOREIGN KEY ("purchasePeriodId") REFERENCES "purchase_periods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD CONSTRAINT "FK_da159f2f16b388e7611eba8c047" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD CONSTRAINT "FK_821c62a4cc28af591395ed7200b" FOREIGN KEY ("purchasePeriodItemId") REFERENCES "purchase_period_items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_items" DROP CONSTRAINT "FK_821c62a4cc28af591395ed7200b"`);
        await queryRunner.query(`ALTER TABLE "request_items" DROP CONSTRAINT "FK_da159f2f16b388e7611eba8c047"`);
        await queryRunner.query(`ALTER TABLE "request_items" DROP CONSTRAINT "FK_b029e1307e472c6870a00d93067"`);
        await queryRunner.query(`ALTER TABLE "request_items" DROP CONSTRAINT "FK_83cfa03629d7982f99ef2103b1c"`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" DROP CONSTRAINT "FK_2ae76396cb34c1d96fd983c80ac"`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" DROP CONSTRAINT "FK_9685a6ae98783bd00a35bd75b13"`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" DROP CONSTRAINT "FK_3019a9b53d2ed2173496599a23a"`);
        await queryRunner.query(`ALTER TABLE "commodity_units" DROP CONSTRAINT "FK_1e1216710932b90e31662305ecc"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" DROP CONSTRAINT "FK_4e5122a7a6575033fe9d208a3c2"`);
        await queryRunner.query(`ALTER TABLE "commodity_units" DROP COLUMN "baseUnitId"`);
        await queryRunner.query(`ALTER TABLE "commodity_units" DROP COLUMN "conversionFactor"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_821c62a4cc28af591395ed7200"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da159f2f16b388e7611eba8c04"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b029e1307e472c6870a00d9306"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83cfa03629d7982f99ef2103b1"`);
        await queryRunner.query(`DROP TABLE "request_items"`);
        await queryRunner.query(`DROP TYPE "public"."request_items_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ae76396cb34c1d96fd983c80a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9685a6ae98783bd00a35bd75b1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3019a9b53d2ed2173496599a23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_38e916795b1eb5e21b4789df65"`);
        await queryRunner.query(`DROP TABLE "purchase_period_items"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_period_items_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3991d107ea28cd503dba998237"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e5122a7a6575033fe9d208a3c"`);
        await queryRunner.query(`DROP TABLE "purchase_periods"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_periods_status_enum"`);
    }

}
