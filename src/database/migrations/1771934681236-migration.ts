import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771934681236 implements MigrationInterface {
    name = 'Migration1771934681236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "groupId" DROP NOT NULL`);

        await queryRunner.query(`
            INSERT INTO "categories" ("groupId", "parentCategoryId", "name", "description", "sortOrder")
            VALUES
                (NULL, NULL, 'Tubers', NULL, 0),
                (NULL, NULL, 'Oils', NULL, 0),
                (NULL, NULL, 'Proteins', NULL, 0),
                (NULL, NULL, 'Grains', NULL, 0),
                (NULL, NULL, 'Fresh Procuce', NULL, 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "categories"
            WHERE "groupId" IS NULL
              AND "parentCategoryId" IS NULL
              AND "name" IN ('Tubers', 'Oils', 'Proteins', 'Grains', 'Fresh Procuce')
        `);

        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "groupId" SET NOT NULL`);
    }
}
