import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771596286423 implements MigrationInterface {
    name = 'Migration1771596286423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'CANCELLED', 'CONFIRMED')`);
        await queryRunner.query(`CREATE TABLE "requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "groupId" uuid NOT NULL, "purchasePeriodId" uuid NOT NULL, "userId" uuid NOT NULL, "totalItems" integer NOT NULL DEFAULT '0', "totalEstimatedCost" numeric(14,2) NOT NULL DEFAULT '0', "status" "public"."requests_status_enum" NOT NULL DEFAULT 'DRAFT', CONSTRAINT "UQ_d4f1810076076e29012293ee24f" UNIQUE ("groupId", "purchasePeriodId", "userId"), CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f5121110b7c08efb2932bff351" ON "requests" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e7b928ba97b68d667699bac151" ON "requests" ("purchasePeriodId") `);
        await queryRunner.query(`CREATE INDEX "IDX_be846ad4b43f40acc7034ef7f4" ON "requests" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_groups" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_groups_role_enum"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" DROP COLUMN "startAt"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" DROP COLUMN "endAt"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" DROP COLUMN "attachDeadline"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'PATRON', 'PROCUREE')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'ADMIN'`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ADD "requestStartDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ADD "requestEndDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ADD "marketRunDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" ADD "minQty" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" ADD "maxQty" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD "requestId" uuid NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."request_items_ifpricehigheraction_enum" AS ENUM('BUY_MAXIMUM', 'BUY_REQUESTED', 'DO_NOT_BUY')`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD "ifPriceHigherAction" "public"."request_items_ifpricehigheraction_enum" NOT NULL DEFAULT 'BUY_REQUESTED'`);
        await queryRunner.query(`CREATE TYPE "public"."request_items_ifpriceloweraction_enum" AS ENUM('BUY_MAXIMUM', 'BUY_REQUESTED', 'DO_NOT_BUY')`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD "ifPriceLowerAction" "public"."request_items_ifpriceloweraction_enum" NOT NULL DEFAULT 'BUY_REQUESTED'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3991d107ea28cd503dba998237"`);
        await queryRunner.query(`ALTER TYPE "public"."purchase_periods_status_enum" RENAME TO "purchase_periods_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_periods_status_enum" AS ENUM('DRAFT', 'OPEN', 'CLOSED', 'FINALIZED', 'PUBLISHED', 'SAVED', 'RECONCILED')`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ALTER COLUMN "status" TYPE "public"."purchase_periods_status_enum" USING "status"::"text"::"public"."purchase_periods_status_enum"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ALTER COLUMN "status" SET DEFAULT 'SAVED'`);
        await queryRunner.query(`DROP TYPE "public"."purchase_periods_status_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_3991d107ea28cd503dba998237" ON "purchase_periods" ("groupId", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_b77e1a37c8b1eb82e872e6b281" ON "request_items" ("requestId") `);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_f5121110b7c08efb2932bff3519" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_e7b928ba97b68d667699bac1514" FOREIGN KEY ("purchasePeriodId") REFERENCES "purchase_periods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_be846ad4b43f40acc7034ef7f40" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD CONSTRAINT "FK_b77e1a37c8b1eb82e872e6b2814" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_items" DROP CONSTRAINT "FK_b77e1a37c8b1eb82e872e6b2814"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_be846ad4b43f40acc7034ef7f40"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_e7b928ba97b68d667699bac1514"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_f5121110b7c08efb2932bff3519"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b77e1a37c8b1eb82e872e6b281"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3991d107ea28cd503dba998237"`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_periods_status_enum_old" AS ENUM('DRAFT', 'OPEN', 'CLOSED', 'FINALIZED')`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ALTER COLUMN "status" TYPE "public"."purchase_periods_status_enum_old" USING "status"::"text"::"public"."purchase_periods_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`);
        await queryRunner.query(`DROP TYPE "public"."purchase_periods_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."purchase_periods_status_enum_old" RENAME TO "purchase_periods_status_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_3991d107ea28cd503dba998237" ON "purchase_periods" ("groupId", "status") `);
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "ifPriceLowerAction"`);
        await queryRunner.query(`DROP TYPE "public"."request_items_ifpriceloweraction_enum"`);
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "ifPriceHigherAction"`);
        await queryRunner.query(`DROP TYPE "public"."request_items_ifpricehigheraction_enum"`);
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "requestId"`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" DROP COLUMN "maxQty"`);
        await queryRunner.query(`ALTER TABLE "purchase_period_items" DROP COLUMN "minQty"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" DROP COLUMN "marketRunDate"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" DROP COLUMN "requestEndDate"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" DROP COLUMN "requestStartDate"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ADD "attachDeadline" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ADD "endAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase_periods" ADD "startAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."user_groups_role_enum" AS ENUM('ADMIN', 'PATRON', 'PROCUREE')`);
        await queryRunner.query(`ALTER TABLE "user_groups" ADD "role" "public"."user_groups_role_enum" NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be846ad4b43f40acc7034ef7f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7b928ba97b68d667699bac151"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5121110b7c08efb2932bff351"`);
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
    }

}
