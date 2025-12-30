import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763468116824 implements MigrationInterface {
    name = 'Migration1763468116824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_cd9db0d209b73ca2094e6401e9"`);
        await queryRunner.query(`ALTER TABLE "commodity_units" DROP CONSTRAINT "uq_unit_per_commodity"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "uq_category_name_per_parent_per_group"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "uq_category_name_per_parent_per_group" UNIQUE ("groupId", "parentCategoryId", "name")`);
        await queryRunner.query(`ALTER TABLE "commodity_units" ADD CONSTRAINT "uq_unit_per_commodity" UNIQUE ("commodityId", "name")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cd9db0d209b73ca2094e6401e9" ON "commodities" ("groupId", "name") `);
    }

}
