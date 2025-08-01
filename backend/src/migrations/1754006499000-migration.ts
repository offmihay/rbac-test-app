import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class Migration1754006499000 implements MigrationInterface {
  name = 'Migration1754006499000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn('[Migration] Skipping admin user creation: ADMIN_EMAIL or ADMIN_PASSWORD not set.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await queryRunner.query(
      `
      INSERT INTO "users" ("id", "email", "password", "fullName", "role", "createdAt")
      VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW())
      `,
      [email, hashedPassword, 'Admin User', 'admin'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      console.warn('[Migration] Skipping admin user removal: ADMIN_EMAIL not set.');
      return;
    }

    await queryRunner.query(`DELETE FROM "users" WHERE "email" = $1`, [email]);
  }
}
