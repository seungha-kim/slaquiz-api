import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddNameToTeam1510583868141 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE "public"."team" ADD "name" character varying NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE "public"."team" DROP "name"');
    }

}
