import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema0011766076877823 implements MigrationInterface {
    name = 'Schema0011766076877823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subcategories" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text NOT NULL, "price" numeric(10,2), "mediaLinks" text array NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "serviceId" uuid NOT NULL, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."discounts_type_enum" AS ENUM('PERCENT', 'FIXED')`);
        await queryRunner.query(`CREATE TYPE "public"."discounts_scope_enum" AS ENUM('SERVICE', 'CART', 'USER')`);
        await queryRunner.query(`CREATE TABLE "discounts" ("id" uuid NOT NULL, "code" character varying(50) NOT NULL, "type" "public"."discounts_type_enum" NOT NULL, "value" numeric(10,2) NOT NULL, "scope" "public"."discounts_scope_enum" NOT NULL, "serviceId" uuid, "userId" uuid, "validFrom" TIMESTAMP, "validUntil" TIMESTAMP, "firstPurchaseOnly" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "serviceId" uuid NOT NULL, "discountId" uuid, "amount" numeric(10,2) NOT NULL, "purchasedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "verification_tokens" ("id" uuid NOT NULL, "token" character varying NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f2d4d7a2aa57ef199e61567db22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_subcategories" ("serviceId" uuid NOT NULL, "subcategoryId" uuid NOT NULL, CONSTRAINT "PK_55e7851365dc88c579bb501f0e7" PRIMARY KEY ("serviceId", "subcategoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_49404072c5f1a363cc9238a409" ON "service_subcategories" ("serviceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1366e53fea2b8415fc8d72d2f5" ON "service_subcategories" ("subcategoryId") `);
        await queryRunner.query(`ALTER TABLE "subcategories" ADD CONSTRAINT "FK_d1fe096726c3c5b8a500950e448" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_1a3d3e21982eac7fee6b44c5ed2" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discounts" ADD CONSTRAINT "FK_3aad5772f2ddb898f6a72632c5c" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discounts" ADD CONSTRAINT "FK_dce34864ac17183325e5d08ddf0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_341f0dbe584866284359f30f3da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_9b9cef260c99658923c413bebed" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_e16e1d8799fcfdbcc3bbde89859" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification_tokens" ADD CONSTRAINT "FK_8eb720a87e85b20fdfc69c38269" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_subcategories" ADD CONSTRAINT "FK_49404072c5f1a363cc9238a4090" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "service_subcategories" ADD CONSTRAINT "FK_1366e53fea2b8415fc8d72d2f5e" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_subcategories" DROP CONSTRAINT "FK_1366e53fea2b8415fc8d72d2f5e"`);
        await queryRunner.query(`ALTER TABLE "service_subcategories" DROP CONSTRAINT "FK_49404072c5f1a363cc9238a4090"`);
        await queryRunner.query(`ALTER TABLE "verification_tokens" DROP CONSTRAINT "FK_8eb720a87e85b20fdfc69c38269"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_e16e1d8799fcfdbcc3bbde89859"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_9b9cef260c99658923c413bebed"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_341f0dbe584866284359f30f3da"`);
        await queryRunner.query(`ALTER TABLE "discounts" DROP CONSTRAINT "FK_dce34864ac17183325e5d08ddf0"`);
        await queryRunner.query(`ALTER TABLE "discounts" DROP CONSTRAINT "FK_3aad5772f2ddb898f6a72632c5c"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_1a3d3e21982eac7fee6b44c5ed2"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8"`);
        await queryRunner.query(`ALTER TABLE "subcategories" DROP CONSTRAINT "FK_d1fe096726c3c5b8a500950e448"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1366e53fea2b8415fc8d72d2f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_49404072c5f1a363cc9238a409"`);
        await queryRunner.query(`DROP TABLE "service_subcategories"`);
        await queryRunner.query(`DROP TABLE "verification_tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TABLE "discounts"`);
        await queryRunner.query(`DROP TYPE "public"."discounts_scope_enum"`);
        await queryRunner.query(`DROP TYPE "public"."discounts_type_enum"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "subcategories"`);
    }

}
