import {MigrationInterface, QueryRunner} from 'typeorm';

export class NotNullableAndUnique1510584184231 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE "public"."team" ADD CONSTRAINT "uk_team_slackId" UNIQUE ("slackId")');
        await queryRunner.query('ALTER TABLE "public"."user" DROP CONSTRAINT "fk_b1e058a7c7090e98739d67a8e32"');
        await queryRunner.query('ALTER TABLE "public"."user" ADD CONSTRAINT "uk_user_slackId" UNIQUE ("slackId")');
        await queryRunner.query('ALTER TABLE "public"."user" ALTER COLUMN "teamId" TYPE integer');
        await queryRunner.query('ALTER TABLE "public"."user" ALTER COLUMN "teamId" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."user" ADD CONSTRAINT "fk_b1e058a7c7090e98739d67a8e32" FOREIGN KEY ("teamId") REFERENCES "team"("id")');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE "public"."user" DROP CONSTRAINT "fk_b1e058a7c7090e98739d67a8e32"');
        await queryRunner.query('-- TODO: revert ALTER TABLE "public"."user" ALTER COLUMN "teamId" SET NOT NULL');
        await queryRunner.query('-- TODO: revert ALTER TABLE "public"."user" ALTER COLUMN "teamId" TYPE integer');
        await queryRunner.query('-- TODO: revert ALTER TABLE "public"."user" ADD CONSTRAINT "uk_user_slackId" UNIQUE ("slackId")');
        await queryRunner.query('ALTER TABLE "public"."user" ADD CONSTRAINT "fk_b1e058a7c7090e98739d67a8e32" FOREIGN KEY ("teamId") REFERENCES "team"("id")');
        await queryRunner.query('-- TODO: revert ALTER TABLE "public"."team" ADD CONSTRAINT "uk_team_slackId" UNIQUE ("slackId")');
    }

}
