import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762426248152 implements MigrationInterface {
    name = 'Migration1762426248152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."verification_codes_purpose_enum" AS ENUM('SIGN_UP', 'LOGIN')`);
        await queryRunner.query(`CREATE TYPE "public"."verification_codes_channel_enum" AS ENUM('EMAIL', 'SMS', 'WHATSAPP')`);
        await queryRunner.query(`CREATE TABLE "verification_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "recipient" character varying(255) NOT NULL, "codeHash" character varying(255) NOT NULL, "purpose" "public"."verification_codes_purpose_enum" NOT NULL, "channel" "public"."verification_codes_channel_enum" NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_18741b6b8bf1680dbf5057421d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_verif_active" ON "verification_codes" ("recipient", "purpose", "expiresAt") `);
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "name" character varying(100) NOT NULL, "description" character varying(255), "inviteCode" character varying(12), CONSTRAINT "uq_group_name" UNIQUE ("name"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_groups_invite_code" ON "groups" ("inviteCode") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" citext NOT NULL, "phone" character varying(20), "emailVerified" boolean NOT NULL DEFAULT false, "phoneVerified" boolean NOT NULL DEFAULT false, "passwordHash" character(60), "currentGroupId" uuid, CONSTRAINT "uq_user_phone" UNIQUE ("phone"), CONSTRAINT "uq_user_email" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_groups_role_enum" AS ENUM('ADMIN', 'PROCUREE')`);
        await queryRunner.query(`CREATE TABLE "user_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "createdby" character varying, "updatedby" character varying, "userId" uuid NOT NULL, "groupId" uuid NOT NULL, "role" "public"."user_groups_role_enum" NOT NULL, CONSTRAINT "uq_user_group" UNIQUE ("userId", "groupId"), CONSTRAINT "PK_ea7760dc75ee1bf0b09ab9b3289" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99d01ff7f143377c044f3d6c95" ON "user_groups" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4dcea3f5c6f04650517d9dc475" ON "user_groups" ("groupId") `);
        await queryRunner.query(`ALTER TABLE "user_groups" ADD CONSTRAINT "FK_99d01ff7f143377c044f3d6c955" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_groups" ADD CONSTRAINT "FK_4dcea3f5c6f04650517d9dc4750" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_groups" DROP CONSTRAINT "FK_4dcea3f5c6f04650517d9dc4750"`);
        await queryRunner.query(`ALTER TABLE "user_groups" DROP CONSTRAINT "FK_99d01ff7f143377c044f3d6c955"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4dcea3f5c6f04650517d9dc475"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_99d01ff7f143377c044f3d6c95"`);
        await queryRunner.query(`DROP TABLE "user_groups"`);
        await queryRunner.query(`DROP TYPE "public"."user_groups_role_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."idx_groups_invite_code"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP INDEX "public"."idx_verif_active"`);
        await queryRunner.query(`DROP TABLE "verification_codes"`);
        await queryRunner.query(`DROP TYPE "public"."verification_codes_channel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."verification_codes_purpose_enum"`);
    }

}
