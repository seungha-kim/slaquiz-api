import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTeamRelationToUser1510583416764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "teamId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "fk_b1e058a7c7090e98739d67a8e32" FOREIGN KEY ("teamId") REFERENCES "team"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "fk_b1e058a7c7090e98739d67a8e32"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "teamId"`);
    }

}
