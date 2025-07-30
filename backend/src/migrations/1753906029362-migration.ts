import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753906029362 implements MigrationInterface {
    name = 'Migration1753906029362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(300) NOT NULL, "category" character varying NOT NULL, "language" character varying NOT NULL, "publisherId" uuid NOT NULL, "imageUrl" character varying, "isApproved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cards" ADD CONSTRAINT "FK_bf0de8c6d32bfd672b13a34e236" FOREIGN KEY ("publisherId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_bf0de8c6d32bfd672b13a34e236"`);
        await queryRunner.query(`DROP TABLE "cards"`);
    }

}
