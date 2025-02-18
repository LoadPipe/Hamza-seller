import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHandleToStore5828595666728 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" ADD COLUMN "handle" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "handle"`);
    }
}
