import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754002566520 implements MigrationInterface {
    name = 'Migration1754002566520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cardId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e98e79e17aec7791345434e7b9d" UNIQUE ("cardId", "userId"), CONSTRAINT "PK_df5bfe575a0ba5571a9bc982e04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "card_likes" ADD CONSTRAINT "FK_dddd57219aad92099e3de30d3ba" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_likes" ADD CONSTRAINT "FK_f0d1fe261a143457393cb24b10a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_likes" DROP CONSTRAINT "FK_f0d1fe261a143457393cb24b10a"`);
        await queryRunner.query(`ALTER TABLE "card_likes" DROP CONSTRAINT "FK_dddd57219aad92099e3de30d3ba"`);
        await queryRunner.query(`DROP TABLE "card_likes"`);
    }

}
