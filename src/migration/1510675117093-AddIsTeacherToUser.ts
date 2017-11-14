import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsTeacherToUser1510675117093 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "isTeacher" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP "isTeacher"`);
    }

}
