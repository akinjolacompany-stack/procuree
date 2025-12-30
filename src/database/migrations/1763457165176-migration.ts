import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763457165176 implements MigrationInterface {
    name = 'Migration1763457165176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "groupId" uuid NOT NULL, "parentCategoryId" uuid, "name" character varying(100) NOT NULL, "description" character varying(255), "sortOrder" integer NOT NULL DEFAULT '0', "parentId" uuid, CONSTRAINT "uq_category_name_per_parent_per_group" UNIQUE ("groupId", "parentCategoryId", "name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d0df92c67a392ee98c311e48ff" ON "categories" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce67fe43d783df641623927e06" ON "categories" ("groupId", "parentCategoryId") `);
        await queryRunner.query(`CREATE TABLE "commodities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "groupId" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" text, "isActive" boolean NOT NULL DEFAULT true, "categoryId" uuid, CONSTRAINT "PK_d8ec0122a7596e8b1b0a275c9c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a90c2824af5346014825f8d8cf" ON "commodities" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d6df812c29ebfa68a6ffbe41f4" ON "commodities" ("categoryId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cd9db0d209b73ca2094e6401e9" ON "commodities" ("groupId", "name") `);
        await queryRunner.query(`CREATE TYPE "public"."commodity_units_type_enum" AS ENUM('SCIENTIFIC', 'COMMON_USE')`);
        await queryRunner.query(`CREATE TABLE "commodity_units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "groupId" uuid NOT NULL, "commodityId" uuid NOT NULL, "type" "public"."commodity_units_type_enum" NOT NULL, "name" character varying(50) NOT NULL, "minQty" numeric(10,2), "maxQty" numeric(10,2), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "uq_unit_per_commodity" UNIQUE ("commodityId", "name"), CONSTRAINT "PK_19aee7befb6b4fbadac8af8d283" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc9cc3b1f602f393ecf14ed0b2" ON "commodity_units" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e6a78ab54fe7fa0d58a7c25a73" ON "commodity_units" ("commodityId") `);
        await queryRunner.query(`ALTER TYPE "public"."user_groups_role_enum" RENAME TO "user_groups_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_groups_role_enum" AS ENUM('ADMIN', 'PATRON', 'PROCUREE')`);
        await queryRunner.query(`ALTER TABLE "user_groups" ALTER COLUMN "role" TYPE "public"."user_groups_role_enum" USING "role"::"text"::"public"."user_groups_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_groups_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_d0df92c67a392ee98c311e48ffe" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commodities" ADD CONSTRAINT "FK_a90c2824af5346014825f8d8cf1" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commodities" ADD CONSTRAINT "FK_d6df812c29ebfa68a6ffbe41f4d" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commodity_units" ADD CONSTRAINT "FK_e6a78ab54fe7fa0d58a7c25a73c" FOREIGN KEY ("commodityId") REFERENCES "commodities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commodity_units" DROP CONSTRAINT "FK_e6a78ab54fe7fa0d58a7c25a73c"`);
        await queryRunner.query(`ALTER TABLE "commodities" DROP CONSTRAINT "FK_d6df812c29ebfa68a6ffbe41f4d"`);
        await queryRunner.query(`ALTER TABLE "commodities" DROP CONSTRAINT "FK_a90c2824af5346014825f8d8cf1"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_d0df92c67a392ee98c311e48ffe"`);
        await queryRunner.query(`CREATE TYPE "public"."user_groups_role_enum_old" AS ENUM('ADMIN', 'PROCUREE')`);
        await queryRunner.query(`ALTER TABLE "user_groups" ALTER COLUMN "role" TYPE "public"."user_groups_role_enum_old" USING "role"::"text"::"public"."user_groups_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_groups_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_groups_role_enum_old" RENAME TO "user_groups_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e6a78ab54fe7fa0d58a7c25a73"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc9cc3b1f602f393ecf14ed0b2"`);
        await queryRunner.query(`DROP TABLE "commodity_units"`);
        await queryRunner.query(`DROP TYPE "public"."commodity_units_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd9db0d209b73ca2094e6401e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d6df812c29ebfa68a6ffbe41f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a90c2824af5346014825f8d8cf"`);
        await queryRunner.query(`DROP TABLE "commodities"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce67fe43d783df641623927e06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0df92c67a392ee98c311e48ff"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
