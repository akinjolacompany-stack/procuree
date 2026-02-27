import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772213867809 implements MigrationInterface {
    name = 'Migration1772213867809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commodity_units" DROP COLUMN "minQty"`);
        await queryRunner.query(`ALTER TABLE "commodity_units" DROP COLUMN "maxQty"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commodity_units" ADD "maxQty" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "commodity_units" ADD "minQty" numeric(10,2)`);
    }

}
